# RewardsAPI
## Problem statement
You are provided with a customer rewards program where points are awarded for shopping at
various outlets which can then be used to claim prizes. The API contains accounts for both staff
and customers. The list of available prizes can also be expanded by a person with the required
authority.

## Technical spec
###  Database model parameters
- Users: [ Long: id, String: Name, String: Type(Staff/Customer) ]
- Payments: [ Long: id, Long: customerID ]
- prizes: [ Long: id, Long: paymentID, Long: customerID, String: status ]
- Note: You can change the schema if needed

### Tasks
1. POST /api/v1/users/signup: A new user is created using this endpoint. A user can be of
three types: customer, employee, and supervisor.
2. POST /api/v1/payments: Adds a new payment record to a customer's account. Based on
the amount, points are added for that particular payment.
3. POST /api/v1/prizes: Used to add a new prize to the list of available prizes.
4. POST /api/v1/customer/prizes/claim: Used to claim a prize with prize-id as query param
for customer with the given id provided the customer has the required amount of points.
5. GET /api/v1/users/customers: Fetches a list of all customer users in the database.
6. GET /api/v1/users/employees: Fetches a list of all employee users in the database.
7. GET /api/v1/payments/{id}: Returns a list of all payment records stored in the customer's
name with the given id.
8. GET /api/v1/payments/{id}/points: Calculates and returns the current points held by a
user.
9. GET /api/v1/prizes/{id}: Fetches a list of all prizes that have been claimed by the
customer with the given id.
10. GET /api/v1/prizes/{id}: Fetches a list of all prizes that have been claimed by the
customer with the given id.

