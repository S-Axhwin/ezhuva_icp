use ic_cdk::api::caller;
use ic_cdk_macros::*;
use ic_principal::Principal;
use std::collections::HashMap;
use std::cell::RefCell;
use candid::Nat;
use candid::CandidType;
use serde::{Serialize,Deserialize};



#[derive(Clone, CandidType, Deserialize)]
struct AssignedWebsite {
    id: u64,
    url: String,
}


#[derive(Clone, CandidType, Serialize)]
struct UptimeReportResponse {
    timestamp: u64,
    status: String,
    response_time: candid::Nat, // or u64 if you prefer nat64
    validator: Principal,
}


#[derive(Clone)]
struct Website {
    id: u64,
    url: String,
    frequency: u64,
    status: String,
    last_checked: u64,
}

#[derive(Clone)]
struct UptimeReport {
    timestamp: u64,
    status: String,
    response_time: u64,
    validator: Principal,
}

#[derive(Clone)]
struct Validator {
    name: String,
    reputation: u64,
    balance: u64,
}


#[derive(Clone, CandidType, Serialize)]
struct WebsiteInfo {
    id: u64,
    url: String,
    frequency: u64,
    status: String,
    last_checked: u64,
}

// =============================
// Thread Local State
// =============================
thread_local! {
    static COMPANY_WEBSITES: RefCell<HashMap<Principal, Vec<Website>>> = RefCell::new(HashMap::new());
    static WEBSITE_REPORTS: RefCell<HashMap<u64, Vec<UptimeReport>>> = RefCell::new(HashMap::new());

    static VALIDATORS: RefCell<HashMap<Principal, Validator>> = RefCell::new(HashMap::new());

    static WEBSITE_COUNTER: RefCell<u64> = RefCell::new(1);
    static VALIDATOR_EVENTS: RefCell<HashMap<Principal, Vec<String>>> = RefCell::new(HashMap::new());

}

// =============================
// COMPANY USERS
// =============================

// Register a new company
#[update]
fn register_company(_name: String) -> bool {
    let user = caller();

    COMPANY_WEBSITES.with(|companies| {
        let mut companies = companies.borrow_mut();
        if companies.contains_key(&user) {
            return false; // Already registered
        }
        companies.insert(user, vec![]);
        true
    })
}

// Submit a website for monitoring
#[update]
fn submit_website(url: String, frequency: u64) -> u64 {
    let user = caller();
    ic_cdk::println!("{}:{}", url,frequency);
    let website_id = WEBSITE_COUNTER.with(|counter| {
        let mut counter = counter.borrow_mut();
        let id = *counter;
        *counter += 1;
        id
    });

    let new_website = Website {
        id: website_id,
        url,
        frequency,
        status: "unknown".to_string(),
        last_checked: 0,
    };

    COMPANY_WEBSITES.with(|companies| {
        let mut companies = companies.borrow_mut();
        companies
            .entry(user)
            .or_insert_with(Vec::new)
            .push(new_website);
    });
    
    
    website_id
}


// Get all websites submitted by this company
#[query]
fn get_my_websites() -> Vec<WebsiteInfo> {
    let user = caller();
    ic_cdk::println!("user asking for websites: {}", user);

    COMPANY_WEBSITES.with(|companies| {
        companies.borrow()
            .get(&user)
            .unwrap_or(&vec![])
            .iter()
            .map(|w| WebsiteInfo {
                id: w.id,
                url: w.url.clone(),
                frequency: w.frequency,
                status: w.status.clone(),
                last_checked: w.last_checked,
            })
            .collect()
    })
}



// Get uptime reports for a specific website
#[query]
fn get_uptime_report(website_id: u64) -> Vec<UptimeReportResponse> {
    WEBSITE_REPORTS.with(|reports| {
        reports.borrow()
            .get(&website_id)
            .unwrap_or(&vec![])
            .iter()
            .map(|r| UptimeReportResponse {
                timestamp: r.timestamp,
                status: r.status.clone(),
                response_time: candid::Nat::from(r.response_time),
                validator: r.validator,
            })
            .collect()
    })
}




// =============================
// VALIDATORS
// =============================

// Validator signup
#[update]
fn register_validator(name: String) -> bool {
    let user = caller();
    ic_cdk::println!("new registreation from vali: : {}", user);
    VALIDATORS.with(|validators| {
        let mut validators = validators.borrow_mut();
        if validators.contains_key(&user) {
            return false;
        }
        validators.insert(user, Validator {
            name,
            reputation: 0,
            balance: 0,
        });
        true
    })
}

// Get assigned websites (returns all websites for now)
#[query]
fn get_assigned_websites() -> Vec<AssignedWebsite> {
    COMPANY_WEBSITES.with(|companies| {
        companies.borrow()
            .values()
            .flat_map(|websites| {
                websites.iter().map(|w| AssignedWebsite {
                    id: w.id,
                    url: w.url.clone(),
                })
            })
            .collect()
    })
}


// Submit uptime proof for a website
#[update]
fn submit_uptime_proof(website_id: u64, status: String, response_time: u64) -> bool {
    let user = caller();

    let timestamp = ic_cdk::api::time();

    let report = UptimeReport {
        timestamp,
        status: status.clone(),
        response_time,
        validator: user,
    };

    WEBSITE_REPORTS.with(|reports| {
        let mut reports = reports.borrow_mut();
        reports.entry(website_id)
            .or_insert(vec![])
            .push(report);
    });

    // Update validator reputation and balance
    VALIDATORS.with(|validators| {
        let mut validators = validators.borrow_mut();
        if let Some(v) = validators.get_mut(&user) {
            v.reputation += 1;
            v.balance += 1; // reward points
        }
    });

    // Update website status and last checked time
    COMPANY_WEBSITES.with(|companies| {
        let mut companies = companies.borrow_mut();
        for websites in companies.values_mut() {
            for w in websites.iter_mut() {
                if w.id == website_id {
                    w.status = status.clone();
                    w.last_checked = timestamp;
                }
            }
        }
    });

    true
}


// Get validator reward balance
#[query]
fn get_balance() -> i64 {
    let user = caller();

    VALIDATORS.with(|validators| {
        validators.borrow()
            .get(&user)
            .map(|v| v.balance as i64)
            .unwrap_or(0)
    })
}

// Withdraw rewards
#[update]
fn withdraw_rewards() -> bool {
    let user = caller();

    VALIDATORS.with(|validators| {
        let mut validators = validators.borrow_mut();
        if let Some(v) = validators.get_mut(&user) {
            if v.balance > 0 {
                v.balance = 0;
                return true;
            }
        }
        false
    })
}

// =============================
// ADMIN / PUBLIC
// =============================

// Get validator leaderboard / stats
#[query]
fn get_validators() -> Vec<(Principal, u64, u64)> {
    VALIDATORS.with(|validators| {
        validators.borrow()
            .iter()
            .map(|(principal, v)| (*principal, v.reputation, v.balance))
            .collect()
    })
}

// Health check
#[query]
fn health_check() -> String {
    "Uptime Monitoring Canister is healthy ✅".to_string()
}

// =============================
// Optional Init
// =============================
#[init]
fn init() {
    ic_cdk::println!("Uptime Monitoring Canister Initialized 🚀");
}