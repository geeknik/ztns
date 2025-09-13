use axum::{
    routing::get,
    Router,
    http::{HeaderValue, Method, header},
};
use tokio::net::TcpListener;
use tower_http::{
    trace::TraceLayer,
    cors::CorsLayer,
    set_header::SetResponseHeaderLayer,
};
use std::time::Duration;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() {
    // Initialize tracing
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "info".into()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();

    // Create the router with security-focused middleware
    let app = Router::new()
        .route("/health", get(health_check))
        .nest_service(
            "/",
            tower_http::services::ServeDir::new(".")
        )
        .layer(TraceLayer::new_for_http())
        .layer(
            CorsLayer::new()
                .allow_origin("http://localhost:3000".parse::<HeaderValue>().unwrap())
                .allow_methods([Method::GET])
                .allow_headers(tower_http::cors::Any)
                .max_age(Duration::from_secs(3600)),
        )
        .layer(SetResponseHeaderLayer::if_not_present(
            header::CONTENT_SECURITY_POLICY,
            HeaderValue::from_static("default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'"),
        ));

    // Start the server
    let port = std::env::var("PORT").unwrap_or_else(|_| "3000".to_string());
    let addr = format!("0.0.0.0:{}", port);
    let listener = TcpListener::bind(&addr).await.unwrap();
    
    tracing::info!("Server listening on {}", addr);
    
    axum::serve(listener, app)
        .await
        .unwrap();
}

// Basic health check endpoint
async fn health_check() -> &'static str {
    "OK"
}

