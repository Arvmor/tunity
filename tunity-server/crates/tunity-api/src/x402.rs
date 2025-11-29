use openlibx402_actix::{X402Config, X402State};

/// The configuration for the X402 state
pub struct ConfigX402(X402State);

impl ConfigX402 {
    /// Build a new ConfigX402
    pub fn build() -> Self {
        let config = X402Config {
            payment_address: "0xaeeb8456f598F7242Ed32bC9658BA20f6B4557fd".to_string(),
            token_mint: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913".to_string(),
            network: "base".to_string(),
            rpc_url: Some("https://mainnet.base.org".to_string()),
            auto_verify: true,
        };

        Self(X402State { config })
    }
}

impl std::ops::Deref for ConfigX402 {
    type Target = X402State;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}
