create database chat

create table users (
    id int identity(1,1) primary key
   ,name varchar(255)
   ,email varchar(255) unique
   ,password varchar(255)
)

create table messages (
    id int identity(1,1) primary key
   ,user_from int
   ,user_to int
   ,message varchar(8000)
)



-- USE [master]
-- GO

-- ALTER LOGIN sa ENABLE;
-- GO

-- ALTER LOGIN sa WITH PASSWORD = 'yourStrong($)Password';
-- GO

-- EXEC xp_instance_regwrite N'HKEY_LOCAL_MACHINE',
--     N'Software\Microsoft\MSSQLServer\MSSQLServer',
--     N'LoginMode', REG_DWORD, 2;
-- GO
