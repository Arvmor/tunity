use xbyte_api::Server;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    #[cfg(debug_assertions)]
    dotenv::dotenv().ok();

    let server = Server::new("127.0.0.1:80");
    server.run().await?;

    Ok(())
}
