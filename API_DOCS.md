# Backend API Documentation

## Authentication & Users
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/users/login` | Login user & get JWT token | Public |
| POST | `/api/users` | Register new user | Public (Admin) |
| GET | `/api/users/me` | Get current logged in user | Private |
| GET | `/api/users` | Get all users | Admin |
| PUT | `/api/users/profile` | Update user profile | Private |

## Parties (Customers & Suppliers)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/parties` | Get all parties |
| POST | `/api/parties` | Create new party |
| PUT | `/api/parties/:id` | Update party details |
| DELETE| `/api/parties/:id` | Delete party |

## Items (Inventory)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/items` | Get all items |
| POST | `/api/items` | Create new item |
| PUT | `/api/items/:id` | Update item |
| DELETE| `/api/items/:id` | Delete item |

## Invoices (Sales)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/invoices` | Get all invoices |
| POST | `/api/invoices` | Create invoice (Deducts Stock) |
| PUT | `/api/invoices/:id` | Update invoice |
| DELETE| `/api/invoices/:id` | Delete invoice (Restores Stock) |

## Purchases
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/purchases` | Get all purchases |
| POST | `/api/purchases` | Create purchase (Adds Stock) |
| PUT | `/api/purchases/:id` | Update purchase |
| DELETE| `/api/purchases/:id` | Delete purchase (Reverses Stock) |

## Quotations
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/quotations` | Get all quotations |
| POST | `/api/quotations` | Create quotation |
| PUT | `/api/quotations/:id` | Update quotation |
| DELETE| `/api/quotations/:id` | Delete quotation |

## Returns (Sales & Purchase Return)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/returns` | Get all returns |
| POST | `/api/returns` | Create return (Adjusts Stock) |
| DELETE| `/api/returns/:id` | Delete return (Reverses Stock) |

## Payments (In & Out)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/payments` | Get all payments |
| POST | `/api/payments` | Record payment |
| DELETE| `/api/payments/:id` | Delete payment |

## Godowns
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/godowns` | Get all godowns |
| POST | `/api/godowns` | Create godown |
| DELETE| `/api/godowns/:id` | Delete godown |
