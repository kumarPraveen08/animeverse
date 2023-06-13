# AnimeVerse

> Backend API for anime quotes

## Simple Usage

Rename config.env.env to config.env and update the values/settings to your own

## Install Dependencies

```
npm install
```

## Run App

```
# run in dev mode
npm run dev

# run in prod mode
npm start
```

## API Quote Endpoints

```
# Get quotes
# Access - Public
# Route - Get
{URL}/api/v1/quotes

# Get random quote
# Access - Public
# Route - Get
{URL}/api/v1/quotes/random

# Get single quote by id
# Access - Public
# Route - Get
{URL}/api/v1/quotes/:id

# Update quote by id
# Access - Private
# Route - PUT
{URL}/api/v1/quotes/:id

# Delete quote by id
# Access - Private
# Route - DELETE
{URL}/api/v1/quotes/:id

# Create new quote
# Access - Private
# Route - POST
{URL}/api/v1/quotes

# quote limit & page
# Access - Public
# Route - GET
{URL}/api/v1/quotes?page=2&limit=10
```

## API User Endpoints

```
# Get users
# Access - Public
# Route - Get
{URL}/api/v1/users

# Get single user by id
# Access - Public
# Route - Get
{URL}/api/v1/users/:id

# Update user by id
# Access - Private
# Route - PUT
{URL}/api/v1/users/:id

# Delete user by id
# Access - Private
# Route - DELETE
{URL}/api/v1/users/:id

# Create new user
# Access - Private
# Route - POST
{URL}/api/v1/users

# user limit & page
# Access - Public
# Route - GET
{URL}/api/v1/users?page=2&limit=10
```

## API Auth Endpoints

```
# Register new user
# Access - Public
# Route - POST
{URL}/api/v1/auth/register

# Login user
# Access - Public
# Route - POST
{URL}/api/v1/auth/login

# Get user details
# Access - Private
# Route - GET
{URL}/api/v1/auth/me

# Update user details
# Access - Private
# Route - PUT
{URL}/api/v1/auth/updatedetails

# Update user password
# Access - Private
# Route - PUT
{URL}/api/v1/auth/updatepassword

# Forgot password
# Access - Public
# Route - POST
{URL}/api/v1/auth/forgotpassword

# Reset password
# Access - Private
# Route - PUT
{URL}/api/v1/auth/resetpassword/:resettoken
```

-Version: 1.0.0  
-License: MIT
