use crate::Client;
use std::collections::HashMap;
use std::sync::{Arc, RwLock};
use uuid::Uuid;

/// A trait for a database
pub trait Database {
    /// The price key type
    type KeyPrice;
    /// The price type
    type Price;
    /// The client key type
    type KeyClient;
    /// The client type
    type Client;

    /// Set the price
    fn set_price(&self, key: Self::KeyPrice, price: Self::Price) -> anyhow::Result<()>;
    /// Get the price
    fn get_price(&self, key: &Self::KeyPrice) -> anyhow::Result<Self::Price>;
    /// Set client
    fn set_client(&self, key: Self::KeyClient, client: Self::Client) -> anyhow::Result<bool>;
    /// Get client
    fn get_client(&self, key: &Self::KeyClient) -> anyhow::Result<Self::Client>;
}

/// In-memory database
#[derive(Debug, Default, Clone)]
pub struct MemoryDB {
    prices: Arc<RwLock<HashMap<(String, String), u64>>>,
    clients: Arc<RwLock<HashMap<Uuid, Client>>>,
}

impl Database for MemoryDB {
    type KeyPrice = (String, String);
    type Price = u64;
    type KeyClient = Uuid;
    type Client = Client;

    fn set_price(&self, key: Self::KeyPrice, price: Self::Price) -> anyhow::Result<()> {
        // Set the price
        let mut db = self.prices.write().unwrap();
        db.insert(key, price);

        Ok(())
    }

    fn get_price(&self, key: &Self::KeyPrice) -> anyhow::Result<Self::Price> {
        let db = self.prices.read().unwrap();
        let result = db.get(key).ok_or(anyhow::anyhow!("Price not found"))?;

        Ok(*result)
    }

    fn set_client(&self, key: Self::KeyClient, client: Self::Client) -> anyhow::Result<bool> {
        let mut db = self.clients.write().unwrap();
        let result = db.insert(key, client);
        Ok(result.is_some())
    }

    fn get_client(&self, key: &Self::KeyClient) -> anyhow::Result<Self::Client> {
        let db = self.clients.read().unwrap();
        let result = db.get(key).ok_or(anyhow::anyhow!("Client not found"))?;

        Ok(result.clone())
    }
}
