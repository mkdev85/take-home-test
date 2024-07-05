## Steps to setup the application:
- Run `npm i` to install the dependencies.

- Configure the following environment variables in .env file. 
 DB_USERNAME: Database username.
 DB_PASSWORD: Database password.
 DB_NAME: Database name.
 DB_HOST: Database host.
 DB_PORT: Database port.

- After configuring the environment, run `npm run db:migrate` to run all migrations. This will set up the database including tables and relations.

- If migrations run properly, run `npm run dev` to start the server.

## API documentation

We have swagger for API documentation. 
Swagger doc URL: http://localhost:3000/api-docs [host and port can be changed as per your configuration]

This will show all the endpoints.

## Configured linting and husky
- To make code style more consistent and bug free, we have implemented husky with precommit hook. So everytime, when user push the code it would check the code styles. 

## Assumptions 
- We have defined the author name as unique.
- In the borrow record entity, the borrow date can't be greater than current date and same return date should be greater than the current date.
- While adding the borrowing record, we have also applied extra validation checks: 
  - User can't borrow the book if their selected duration already exists for the same book borrow record.
 Example: 
    - If book 'A' is already borrowed in duration `2024-07-05` [Borrow Date] and `2024-07-09` [Return Date] 
    - If the user wants to borrow the same book in this duration then we will throw an error because the book is already borrowed for this duration.   

## Covered bonus points:
- Added pagination on all the resources i.e /authors [GET], /books [GET] and /borrow-records [GET]
- Apart from pagination, also applied filtering on above resources. You can check the full details in the swagger doc.
- Created basic docker file.

# Not covered:
- Test cases: Due to the time limit, I have not written the test cases but it's not a big deal for me. If I have extra time, I would definitely complete it. 
