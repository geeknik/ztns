use thiserror::Error;

pub type Result<T> = std::result::Result<T, Error>;

#[derive(Error, Debug)]
pub enum Error {
    #[error("Authentication error: {0}")]
    Auth(String),

    #[error("Network simulation error: {0}")]
    Network(String),

    #[error("API error: {0}")]
    Api(String),

    #[error("Static file error: {0}")]
    StaticFile(String),

    #[error("Internal error: {0}")]
    Internal(String),
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_error_display() {
        let err = Error::Auth("invalid token".to_string());
        assert_eq!(err.to_string(), "Authentication error: invalid token");
    }
}
