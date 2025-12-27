use alloy_primitives::{Address, address};
use alloy_provider::Provider;
use alloy_sol_types::sol;
use std::ops::Deref;

sol! {
    #[sol(rpc)]
    "../../../xbyte-contracts/src/xByteFactory.sol"
}

/// Factory Interface for [`xByteFactory`] contract.
#[derive(Debug, Clone)]
pub struct Factory<P: Provider>(xByteFactory::xByteFactoryInstance<P>);

impl<P: Provider> Factory<P> {
    /// The address of the xByteFactory contract
    pub const ADDRESS: Address = address!("b0b6c2EC918388aE785541a0635E36c69358A80d");
    /// Initialize an Instance of the Factory
    pub fn new(provider: P) -> Self {
        let instance = xByteFactory::xByteFactoryInstance::new(Self::ADDRESS, provider);
        Self(instance)
    }
}

impl<P: Provider> Deref for Factory<P> {
    type Target = xByteFactory::xByteFactoryInstance<P>;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::Client;

    #[test]
    fn test_factory() -> anyhow::Result<()> {
        let provider = Client::new("http://localhost:8545")?;
        Factory::new(provider);

        Ok(())
    }
}
