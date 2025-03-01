DECLARE @ConstraintNameForCreatedAt NVARCHAR(200);

SELECT @ConstraintNameForCreatedAt = name
FROM sys.default_constraints 
WHERE parent_object_id = OBJECT_ID('Bids') 
AND parent_column_id = COLUMNPROPERTY(parent_object_id, 'CreatedAt', 'ColumnId');

IF @ConstraintNameForCreatedAt IS NOT NULL
BEGIN
    EXEC('ALTER TABLE Bids DROP CONSTRAINT ' + @ConstraintNameForCreatedAt);
END

DECLARE @ConstraintNameForUpdatedAt NVARCHAR(200);

SELECT @ConstraintNameForUpdatedAt = name
FROM sys.default_constraints 
WHERE parent_object_id = OBJECT_ID('Bids') 
AND parent_column_id = COLUMNPROPERTY(parent_object_id, 'UpdatedAt', 'ColumnId');

IF @ConstraintNameForUpdatedAt IS NOT NULL
BEGIN
    EXEC('ALTER TABLE Bids DROP CONSTRAINT ' + @ConstraintNameForUpdatedAt);
END

ALTER TABLE Bids
ALTER COLUMN CreatedAt DATETIMEOFFSET(7) NOT NULL;

ALTER TABLE Bids
ALTER COLUMN UpdatedAt DATETIMEOFFSET(7) NOT NULL;
