pub mod error;

pub use error::Error;
pub use error::Result;

#[cfg(test)]
mod tests {
    #[test]
    fn test_module_setup() {
        assert!(true, "Basic module structure test");
    }
}
