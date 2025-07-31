from fastapi import APIRouter
from app.api.api_v1.endpoints import (
    auth,
    users,
    wallets,
    transactions,
    invoices,
    credit,
    autopartes,
    factoring,
    cfdi
)

api_router = APIRouter()

# Authentication
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])

# Core Resources
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(wallets.router, prefix="/wallets", tags=["Wallets"])
api_router.include_router(transactions.router, prefix="/transactions", tags=["Transactions"])

# Financial Services
api_router.include_router(invoices.router, prefix="/invoices", tags=["Invoices"])
api_router.include_router(credit.router, prefix="/credit", tags=["Credit Lines"])
api_router.include_router(factoring.router, prefix="/factoring", tags=["Factoring"])
api_router.include_router(cfdi.router, prefix="/cfdi", tags=["CFDI"])

# AutoPartes Marketplace
api_router.include_router(autopartes.router, prefix="/autopartes", tags=["AutoPartes"])
