use anyhow::Result;
use csv::Reader;
use serde::{de::DeserializeOwned};
use std::path::Path;

pub struct Bulk<T>
where
    T: DeserializeOwned,
{
    pub data: Vec<T>,
    pub errors: Vec<(usize, String)>,
}
impl<T: DeserializeOwned> Bulk<T> {
    /// Reads in data from csv/tsv at given path
    pub fn new(path: &Path) -> Result<Self> {
        let mut reader = csv::ReaderBuilder::new()
            .delimiter(match path.extension() {
                None => b',',
                Some(t) => match t.to_str() {
                    Some("csv") => b',',
                    Some("tsv") => b'\t',
                    _ => b',',
                },
            })
            .from_path(path)?;
        
            Ok(Self::from_reader(&mut reader))
    }

    pub fn from_reader<K: std::io::Read>(reader: &mut Reader<K>) -> Self {
        let mut data: Vec<T> = vec![];
        let mut errors: Vec<(usize, String)> = vec![];
        for (i, rec) in reader.deserialize::<T>().enumerate() {
            match rec {
                Ok(val) => data.push(val),
                Err(e) => errors.push((i, e.to_string())),
            }
        }

        Self {
            data,
            errors,
        } 
    }
}
