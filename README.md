# itis-nature-nexus-backend

## SQL Data Tables:

## I. Observational Data

### 1. Temporal Observation Data Table:

```
CREATE TABLE observation_temporal (
    gbifID BIGINT PRIMARY KEY,
    eventDate DATE,
    year INT,
    month INT,
    day INT,
    stateProvince VARCHAR(255)
);
```

### 2. Geospatial Observation Data Table:

```
CREATE TABLE observation_geospatial (
    gbifID BIGINT PRIMARY KEY,
    stateProvince VARCHAR(255),
    locality VARCHAR(255),
    decimalLatitude FLOAT,
    decimalLongitude FLOAT,
    FOREIGN KEY (gbifID) REFERENCES observation_temporal(gbifID)
);
```

### 3. Detailed Bird Observations:

```
CREATE TABLE bird_details (
    gbifID BIGINT PRIMARY KEY,
    scientificName VARCHAR(255),
    iucnRedListCategory VARCHAR(50),
    family VARCHAR(255),
    genus VARCHAR(255),
    FOREIGN KEY (gbifID) REFERENCES observation_temporal(gbifID)
);
```


## II. Climate Data

### 1. Precipitation Data Table:

```
CREATE TABLE climate_precipitation (
    year INT,
    annual_precipitation_median FLOAT,
    precipitation_p10 FLOAT,
    precipitation_p90 FLOAT
);
```

### 2. Temperature Data Table:

```
CREATE TABLE climate_temperature (
    year INT,
    annual_temperature_median FLOAT,
    temperature_p10 FLOAT,
    temperature_p90 FLOAT
);
```


### Current SQL Code:
```
--GRANT SELECT,INSERT,UPDATE,DELETE ON observation_temporal TO "DORIAN.DEJESUS";
--GRANT SELECT,INSERT,UPDATE,DELETE ON observation_temporal TO JFLOTHE;
--GRANT SELECT,INSERT,UPDATE,DELETE ON observation_temporal TO NGLEASON;
--GRANT SELECT,INSERT,UPDATE,DELETE ON observation_temporal TO RCAPUNO;
--
--
--GRANT SELECT,INSERT,UPDATE,DELETE ON observation_geospatial TO "DORIAN.DEJESUS";
--GRANT SELECT,INSERT,UPDATE,DELETE ON observation_geospatial TO JFLOTHE;
--GRANT SELECT,INSERT,UPDATE,DELETE ON observation_geospatial TO NGLEASON;
--GRANT SELECT,INSERT,UPDATE,DELETE ON observation_geospatial TO RCAPUNO;
--
--
--
--GRANT SELECT,INSERT,UPDATE,DELETE ON bird_details TO "DORIAN.DEJESUS";
--GRANT SELECT,INSERT,UPDATE,DELETE ON bird_details TO JFLOTHE;
--GRANT SELECT,INSERT,UPDATE,DELETE ON bird_details TO NGLEASON;
--GRANT SELECT,INSERT,UPDATE,DELETE ON bird_details TO RCAPUNO;
--
--
--
--GRANT SELECT,INSERT,UPDATE,DELETE ON climate_precipitation TO "DORIAN.DEJESUS";
--GRANT SELECT,INSERT,UPDATE,DELETE ON climate_precipitation TO JFLOTHE;
--GRANT SELECT,INSERT,UPDATE,DELETE ON climate_precipitation TO NGLEASON;
--GRANT SELECT,INSERT,UPDATE,DELETE ON climate_precipitation TO RCAPUNO;
--
--
--GRANT SELECT,INSERT,UPDATE,DELETE ON climate_temperature TO "DORIAN.DEJESUS";
--GRANT SELECT,INSERT,UPDATE,DELETE ON climate_temperature TO JFLOTHE;
--GRANT SELECT,INSERT,UPDATE,DELETE ON climate_temperature TO NGLEASON;
--GRANT SELECT,INSERT,UPDATE,DELETE ON climate_temperature TO RCAPUNO;


---------- I. Observational Data
---- 1. Temporal Observation Data Table:
--CREATE TABLE observation_temporal (
--    gbifID NUMBER(19) PRIMARY KEY,
--    eventDate DATE,
--    year NUMBER(4),
--    month NUMBER(2),
--    day NUMBER(2),
--    stateProvince VARCHAR2(255)
--);
--
---- 2. Geospatial Observation Data Table:
--CREATE TABLE observation_geospatial (
--    gbifID NUMBER(19) PRIMARY KEY,
--    stateProvince VARCHAR2(255),
--    locality VARCHAR2(255),
--    decimalLatitude FLOAT,
--    decimalLongitude FLOAT,
--    FOREIGN KEY (gbifID) REFERENCES observation_temporal(gbifID)
--);
--
---- 3. Detailed Bird Observations:
--CREATE TABLE bird_details (
--    gbifID NUMBER(19) PRIMARY KEY,
--    scientificName VARCHAR2(255),
--    iucnRedListCategory VARCHAR2(50),
--    family VARCHAR2(255),
--    genus VARCHAR2(255),
--    FOREIGN KEY (gbifID) REFERENCES observation_temporal(gbifID)
--);


---------- II. Climate Data
---- 1. Precipitation Data Table:
--CREATE TABLE climate_precipitation (
--    year INT,
--    annual_precipitation_median FLOAT,
--    precipitation_p10 FLOAT,
--    precipitation_p90 FLOAT
--);
--
---- 2. Temperature Data Table:
--CREATE TABLE climate_temperature (
--    year INT,
--    annual_temperature_median FLOAT,
--    temperature_p10 FLOAT,
--    temperature_p90 FLOAT
--);


SELECT * FROM observation_temporal;
SELECT * FROM observation_geospatial;
SELECT * FROM bird_details;
SELECT * FROM climate_precipitation;
SELECT * FROM climate_temperature;

```