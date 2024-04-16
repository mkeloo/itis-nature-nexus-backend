-- GRANT SELECT,INSERT,UPDATE,DELETE ON observation_temporal TO "DORIAN.DEJESUS";
-- GRANT SELECT,INSERT,UPDATE,DELETE ON observation_temporal TO JFLOTHE;
-- GRANT SELECT,INSERT,UPDATE,DELETE ON observation_temporal TO NGLEASON;
-- GRANT SELECT,INSERT,UPDATE,DELETE ON observation_temporal TO RCAPUNO;


-- GRANT SELECT,INSERT,UPDATE,DELETE ON observation_geospatial TO "DORIAN.DEJESUS";
-- GRANT SELECT,INSERT,UPDATE,DELETE ON observation_geospatial TO JFLOTHE;
-- GRANT SELECT,INSERT,UPDATE,DELETE ON observation_geospatial TO NGLEASON;
-- GRANT SELECT,INSERT,UPDATE,DELETE ON observation_geospatial TO RCAPUNO;



-- GRANT SELECT,INSERT,UPDATE,DELETE ON bird_details TO "DORIAN.DEJESUS";
-- GRANT SELECT,INSERT,UPDATE,DELETE ON bird_details TO JFLOTHE;
-- GRANT SELECT,INSERT,UPDATE,DELETE ON bird_details TO NGLEASON;
-- GRANT SELECT,INSERT,UPDATE,DELETE ON bird_details TO RCAPUNO;



-- GRANT SELECT,INSERT,UPDATE,DELETE ON climate_precipitation TO "DORIAN.DEJESUS";
-- GRANT SELECT,INSERT,UPDATE,DELETE ON climate_precipitation TO JFLOTHE;
-- GRANT SELECT,INSERT,UPDATE,DELETE ON climate_precipitation TO NGLEASON;
-- GRANT SELECT,INSERT,UPDATE,DELETE ON climate_precipitation TO RCAPUNO;


-- GRANT SELECT,INSERT,UPDATE,DELETE ON climate_temperature TO "DORIAN.DEJESUS";
-- GRANT SELECT,INSERT,UPDATE,DELETE ON climate_temperature TO JFLOTHE;
-- GRANT SELECT,INSERT,UPDATE,DELETE ON climate_temperature TO NGLEASON;
-- GRANT SELECT,INSERT,UPDATE,DELETE ON climate_temperature TO RCAPUNO;


-------- I. Observational Data
-- 1. Temporal Observation Data Table:
CREATE TABLE observation_temporal (
   gbifID NUMBER(19) PRIMARY KEY,
   eventDate DATE,
   year NUMBER(4),
   month NUMBER(2),
   day NUMBER(2),
   stateProvince VARCHAR2(255)
);

-- 2. Geospatial Observation Data Table:
CREATE TABLE observation_geospatial (
   gbifID NUMBER(19) PRIMARY KEY,
   stateProvince VARCHAR2(255),
   locality VARCHAR2(255),
   decimalLatitude FLOAT,
   decimalLongitude FLOAT,
   FOREIGN KEY (gbifID) REFERENCES observation_temporal(gbifID)
);

-- 3. Detailed Bird Observations:
CREATE TABLE bird_details (
   gbifID NUMBER(19) PRIMARY KEY,
   scientificName VARCHAR2(255),
   iucnRedListCategory VARCHAR2(50),
   family VARCHAR2(255),
   genus VARCHAR2(255),
   FOREIGN KEY (gbifID) REFERENCES observation_temporal(gbifID)
);


-------- II. Climate Data
-- 1. Precipitation Data Table:
CREATE TABLE climate_precipitation (
   year INT,
   annual_precipitation_median FLOAT,
   precipitation_p10 FLOAT,
   precipitation_p90 FLOAT
);

-- 2. Temperature Data Table:
CREATE TABLE climate_temperature (
   year INT,
   annual_temperature_median FLOAT,
   temperature_p10 FLOAT,
   temperature_p90 FLOAT
);


SELECT * FROM observation_temporal;
SELECT * FROM observation_geospatial;
SELECT * FROM bird_details;
SELECT * FROM climate_precipitation;
SELECT * FROM climate_temperature;



-- Adjusted Query 1 for dynamic input with example years provided:
WITH bird_observations_summary AS (
   SELECT
       o.stateProvince,
       EXTRACT(YEAR FROM o.eventDate) AS observation_year,
       COUNT(DISTINCT b.scientificName) AS species_count,
       COUNT(*) AS observation_count
   FROM
       observation_temporal o
       JOIN bird_details b ON o.gbifID = b.gbifID
   WHERE
       (o.stateProvince = 'Tirol' OR o.stateProvince IS NULL)  -- User can specify like "Tirol" here or leave null for all provinces
       AND EXTRACT(YEAR FROM o.eventDate) BETWEEN 2010 AND 2020  -- Dynamic range, can be changed as needed
   GROUP BY
       o.stateProvince, EXTRACT(YEAR FROM o.eventDate)
),
climate_summary AS (
   SELECT
       p.year,
       p.annual_precipitation_median AS precipitation,
       t.annual_temperature_median AS avg_temperature
   FROM
       climate_precipitation p
       JOIN climate_temperature t ON p.year = t.year
   WHERE
       p.year BETWEEN 2010 AND 2020  -- Matching the observation year range
),
combined_analysis AS (
   SELECT
       b.stateProvince,
       b.observation_year AS year,
       b.species_count,
       b.observation_count,
       c.precipitation,
       c.avg_temperature
   FROM
       bird_observations_summary b
       JOIN climate_summary c ON b.observation_year = c.year
)
SELECT
   ca.stateProvince,
   ca.year,
   ca.species_count,
   ca.observation_count,
   ca.precipitation,
   ca.avg_temperature,
   CASE
       WHEN ca.precipitation > (SELECT AVG(precipitation) FROM climate_summary) THEN 'High Precipitation'
       WHEN ca.avg_temperature > (SELECT AVG(avg_temperature) FROM climate_summary) THEN 'High Temperature'
       ELSE 'Average Conditions'
   END AS climate_condition
FROM
   combined_analysis ca
ORDER BY
   ca.year, ca.stateProvince;  -- Ordering by year and stateProvince, customizable



-- Adjusted Query 2 incorporating climate data for a more comprehensive analysis
WITH yearly_data AS (
    SELECT
        ot.year,
        bd.scientificName,
        COUNT(*) AS observation_count
    FROM
        observation_temporal ot
        JOIN bird_details bd ON ot.gbifID = bd.gbifID
    WHERE
        ot.year BETWEEN 2010 AND 2020  -- Analysis range: 2010 to 2020, customizable
    GROUP BY
        ot.year, bd.scientificName
),
diversity_index AS (
    SELECT
        year,
        COUNT(scientificName) AS species_count,
        SUM(observation_count) AS total_observations,
        SUM(observation_count * LN(observation_count)) AS sum_ln_observations
    FROM
        yearly_data
    GROUP BY
        year
),
biodiversity_scores AS (
    SELECT
        year,
        species_count,
        EXP((sum_ln_observations / total_observations) - LN(total_observations / species_count)) AS biodiversity_index
    FROM
        diversity_index
),
climate_data AS (
    SELECT
        p.year,
        p.annual_precipitation_median AS precipitation_median,
        t.annual_temperature_median AS temperature_median
    FROM
        climate_precipitation p
    JOIN
        climate_temperature t ON p.year = t.year
)
SELECT
    bs.year,
    ROUND(bs.biodiversity_index, 2) AS biodiversity_score,
    cd.precipitation_median,
    cd.temperature_median
FROM
    biodiversity_scores bs
JOIN
    climate_data cd ON bs.year = cd.year
ORDER BY
    bs.year;  -- Ordered by year, additional sorting by biodiversity_score or climate factors possible



-- Adjusted Query 3 with hardcoded example values for dynamic input:
WITH yearly_observations AS (
   SELECT
       bd.scientificName,
       ot.year,
       COUNT(*) AS observation_count
   FROM
       observation_temporal ot
       JOIN bird_details bd ON ot.gbifID = bd.gbifID
   WHERE
       ot.year BETWEEN 2010 AND 2020  -- Analysis range is currently set from 2010 to 2020, change as needed
   GROUP BY
       bd.scientificName, ot.year
),
growth_rates AS (
   SELECT
       scientificName,
       year,
       observation_count,
       LAG(observation_count) OVER (PARTITION BY scientificName ORDER BY year) AS prev_year_count,
       (observation_count - LAG(observation_count) OVER (PARTITION BY scientificName ORDER BY year)) / LAG(observation_count) OVER (PARTITION BY scientificName ORDER BY year) AS growth_rate
   FROM
       yearly_observations
),
significant_changes AS (
   SELECT
       scientificName,
       year,
       observation_count,
       prev_year_count,
       growth_rate,
       ROUND(growth_rate * 100, 2) AS growth_rate_percentage
   FROM
       growth_rates
   WHERE
       ABS(growth_rate) >= 0.5  -- Filtering to show only significant changes: 50% increase or decrease
)
SELECT
   scientificName,
   year,
   observation_count,
   prev_year_count,
   growth_rate_percentage
FROM
   significant_changes
ORDER BY
   growth_rate_percentage DESC, scientificName, year;  -- Ordering by most significant changes first


-- Adjusted Query 4 for dynamic input with example values:
WITH annual_data AS (
   SELECT DISTINCT
       og.stateProvince,
       ot.year,
       bd.scientificName,
       bd.iucnRedListCategory,
       COUNT(*) AS observation_count
   FROM
       observation_temporal ot
       JOIN observation_geospatial og ON ot.gbifID = og.gbifID
       JOIN bird_details bd ON ot.gbifID = bd.gbifID
   WHERE
       ot.year BETWEEN 2010 AND 2020  -- Example range: 2010 to 2020, can be changed as needed
       AND (og.stateProvince = 'Burgenland' OR og.stateProvince IS NULL)  -- User can specify like "Burgenland" here to Filter by stateProvince or include all
   GROUP BY
       og.stateProvince,
       ot.year,
       bd.scientificName,
       bd.iucnRedListCategory
),
biodiversity_index AS (
   SELECT DISTINCT
       stateProvince,
       year,
       COUNT(DISTINCT scientificName) AS species_count,
       SUM(observation_count) AS total_observations,
       EXP(SUM(observation_count * LN(observation_count)) / SUM(observation_count) - LN(SUM(observation_count) / COUNT(DISTINCT scientificName))) AS biodiversity_index
   FROM
       annual_data
   GROUP BY
       stateProvince,
       year
),
growth_rates AS (
   SELECT DISTINCT
       stateProvince,
       scientificName,
       year,
       observation_count,
       LAG(observation_count, 1) OVER (PARTITION BY stateProvince, scientificName ORDER BY year) AS prev_year_count,
       (observation_count - LAG(observation_count, 1) OVER (PARTITION BY stateProvince, scientificName ORDER BY year)) / LAG(observation_count, 1) OVER (PARTITION BY stateProvince, scientificName ORDER BY year) AS growth_rate
   FROM
       annual_data
),
conservation_trends AS (
   SELECT DISTINCT
       stateProvince,
       year,
       iucnRedListCategory,
       COUNT(*) AS category_count,
       RANK() OVER (PARTITION BY stateProvince, year ORDER BY COUNT(*) DESC) AS rank
   FROM
       annual_data
   GROUP BY
       stateProvince,
       year,
       iucnRedListCategory
)
SELECT DISTINCT
   a.stateProvince,
   a.year,
   b.species_count,
   b.total_observations,
   b.biodiversity_index,
   c.scientificName,
   c.observation_count,
   c.prev_year_count,
   c.growth_rate,
   d.iucnRedListCategory,
   d.category_count
FROM
   annual_data a
   JOIN biodiversity_index b ON a.stateProvince = b.stateProvince AND a.year = b.year
   JOIN growth_rates c ON a.stateProvince = c.stateProvince AND a.year = c.year
   JOIN conservation_trends d ON a.stateProvince = d.stateProvince AND a.year = d.year AND d.rank = 1
ORDER BY
   b.biodiversity_index DESC, a.year, a.stateProvince;  -- Order can be adjusted to focus on different aspects


-- Adjusted Query 5 for dynamic input with example values:
WITH RegionTaxonomy AS (
   SELECT
       og.stateProvince,
       bd.family,
       bd.genus,
       COUNT(DISTINCT bd.scientificName) AS NumberOfSpecies,
       COUNT(DISTINCT CASE WHEN bd.iucnRedListCategory IN ('VU', 'EN', 'CR') THEN bd.scientificName END) AS ThreatenedSpecies
   FROM
       observation_geospatial og
       JOIN bird_details bd ON og.gbifID = bd.gbifID
   WHERE
       (og.stateProvince = 'Tirol' OR og.stateProvince IS NULL)  -- Example stateProvince or include all if NULL
       AND (bd.family = 'Accipitridae' OR bd.family IS NULL)  -- Example family or include all if NULL
       AND (bd.genus = 'Aquila' OR bd.genus IS NULL)  -- Example genus or include all if NULL
   GROUP BY
       og.stateProvince, bd.family, bd.genus
),
ConservationFocus AS (
   SELECT
       stateProvince,
       family,
       genus,
       NumberOfSpecies,
       ThreatenedSpecies,
       (CAST(ThreatenedSpecies AS FLOAT) / NumberOfSpecies) * 100 AS ThreatenedPercentage
   FROM
       RegionTaxonomy
)
SELECT
   stateProvince,
   family,
   genus,
   NumberOfSpecies,
   ThreatenedSpecies,
   ROUND(ThreatenedPercentage, 2) AS ThreatenedPercentage
FROM
   ConservationFocus
ORDER BY
   ThreatenedPercentage DESC, ThreatenedSpecies DESC;  -- Order by highest percentage of threatened species, customizable
   
    
    
    

-- Adjusted Query 5 for dynamic input with example values and fetching multiple stateProvinces:
WITH RegionTaxonomy AS (
   SELECT
       og.stateProvince,
       bd.family,
       bd.genus,
       COUNT(DISTINCT bd.scientificName) AS NumberOfSpecies,
       COUNT(DISTINCT CASE WHEN bd.iucnRedListCategory IN ('VU', 'EN', 'CR') THEN bd.scientificName END) AS ThreatenedSpecies
   FROM
       observation_geospatial og
       JOIN bird_details bd ON og.gbifID = bd.gbifID
   WHERE
       og.stateProvince IN ('Tirol', 'Wien', 'Niederösterreich', 'Kärnten', 'Salzburg')  -- Specify multiple regions as examples
   GROUP BY
       og.stateProvince, bd.family, bd.genus
),
ConservationFocus AS (
   SELECT
       stateProvince,
       family,
       genus,
       NumberOfSpecies,
       ThreatenedSpecies,
       (CAST(ThreatenedSpecies AS FLOAT) / NumberOfSpecies) * 100 AS ThreatenedPercentage
   FROM
       RegionTaxonomy
)
SELECT
   stateProvince,
   family,
   genus,
   NumberOfSpecies,
   ThreatenedSpecies,
   ROUND(ThreatenedPercentage, 2) AS ThreatenedPercentage
FROM
   ConservationFocus
ORDER BY
   ThreatenedPercentage DESC, stateProvince, family, genus;  -- Order can be customized based on user needs
