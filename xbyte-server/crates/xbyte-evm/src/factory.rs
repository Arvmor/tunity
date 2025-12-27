use alloy_primitives::Address;
use alloy_provider::Provider;
use alloy_sol_types::sol;
use std::ops::Deref;

sol! {
    #[sol(rpc)]
    "../../../xbyte-contracts/src/xByteFactory.sol"
}

/// Factory Interface for [`xByteFactory`] contract.
pub struct Factory<P: Provider>(xByteFactory::xByteFactoryInstance<P>);

impl<P: Provider> Factory<P> {
    pub fn new(address: Address, provider: P) -> Self {
        Self(xByteFactory::xByteFactoryInstance::new(address, provider))
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
    use alloy_primitives::Address;

    use super::*;
    use crate::Client;

    #[test]
    fn test_factory() -> anyhow::Result<()> {
        let provider = Client::new("http://localhost:8545")?;
        Factory::new(Address::ZERO, provider);

        Ok(())
    }
}
