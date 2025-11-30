use crate::ResultAPI;
use crate::x402::{ConfigX402, FacilitatorRequest, PaymentExtractor, X402Response};
use actix_web::dev::HttpServiceFactory;
use actix_web::{HttpRequest, web};
use actix_web::{Responder, get};
use openlibx402_actix::{PaymentRequirement, create_payment_request};

/// The Player Routes
#[derive(Debug)]
pub enum PlayerRoute {
    /// The play endpoint
    Play,
}

impl HttpServiceFactory for PlayerRoute {
    fn register(self, config: &mut actix_web::dev::AppService) {
        match self {
            Self::Play => play.register(config),
        }
    }
}

/// The play endpoint
#[get("/play")]
async fn play(
    request: HttpRequest,
    state: web::Data<ConfigX402>,
    auth: Option<PaymentExtractor>,
) -> impl Responder {
    let config = state.config.clone();
    let req = PaymentRequirement::new("1000").with_description("Access to play the track");
    let payload = create_payment_request(&config, &req, request.full_url().as_str());

    // Check received payment
    let request = X402Response::from((config, payload));
    let Some(payment) = auth else {
        return ResultAPI::payment_required(request);
    };

    // Verify and settle the payment
    let facilitator = FacilitatorRequest::new(payment, request.accepts[0].clone());
    if let Ok(response) = facilitator.verify()
        && Some(true) == response.is_valid
    {
        actix_web::rt::spawn(async move { facilitator.settle() });
        return ResultAPI::verified_payment("Access granted to basic tier");
    };

    ResultAPI::payment_required(request)
}
