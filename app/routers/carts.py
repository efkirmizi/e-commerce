from fastapi import APIRouter, status, Query, Depends, HTTPException
from app.schemas.carts import CartsOutList, CartOut, CartCreate, CartUpdate
from app.database import get_db
from app.oauth2 import get_current_user
from app.models import User, Cart, Product, CartItem
from sqlalchemy import asc
from sqlalchemy.orm import Session


router = APIRouter(
    prefix="/carts",
    tags=["Carts"]
)


@router.get(
    path="/",
    status_code=status.HTTP_200_OK,
    response_model=CartsOutList
)
def get_all_carts(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cards = db.query(Cart).\
        filter(Cart.user_id == current_user.id).\
        order_by(asc(Cart.id)).\
        offset((page - 1) * limit).\
        limit(limit).all()
    return {"data": cards}


@router.get(
    path="/{cart_id}",
    status_code=status.HTTP_200_OK,
    response_model=CartOut
)
def get_cart(
    cart_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cart = db.query(Cart).\
        filter(
            Cart.id == cart_id,
            Cart.user_id == current_user.id
        ).\
        first()
    
    if not cart:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Cart with id: {cart_id} does not exist!"
        )
    return cart


@router.post(
    path="/",
    status_code=status.HTTP_201_CREATED,
    response_model=CartOut
)
def create_cart(
    cart: CartCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cart_dict = cart.model_dump()

    cart_items_data = cart_dict.pop("cart_items", [])
    cart_items = []
    total_amount = 0
    for item_data in cart_items_data:
        product_id = item_data['product_id']
        quantity = item_data['quantity']

        product = db.query(Product).\
            filter(Product.id == product_id).\
            first()

        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product with id: {product_id} does not exist!"
            )
        
        subtotal = quantity * product.price * (1 - (product.discount_percentage / 100))
        cart_item = CartItem(
            product_id=product_id, 
            quantity=quantity,
            subtotal=subtotal
        )
        total_amount += subtotal
        cart_items.append(cart_item)

    cart_db = Cart(
        user_id=current_user.id,
        total_amount=total_amount,
        cart_items=cart_items,
        **cart_dict
    )

    db.add(cart_db)
    db.commit()
    db.refresh(cart_db)

    return cart_db


@router.put(
    path="/{cart_id}",
    status_code=status.HTTP_200_OK,
    response_model=CartOut
)
def update_cart(
    cart_id: int,
    updated_cart: CartUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cart = db.query(Cart).\
        filter(
            Cart.user_id == current_user.id,
            Cart.id == cart_id
        ).\
        first()

    if not cart:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Cart with id: {cart_id} does not exist!"
        )
    
    cart_items = db.query(CartItem).\
        filter(CartItem.cart_id == cart_id).\
        all()

    for item in cart_items:
        db.delete(item)

    total_amount = 0
    for item in updated_cart.cart_items:
        product_id = item.product_id
        quantity = item.quantity

        product = db.query(Product).\
            filter(Product.id == product_id).\
            first()

        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product with id: {product_id} does not exist!"
            )
        
        subtotal = quantity * product.price * (1 - (product.discount_percentage / 100))
        cart_item = CartItem(
            cart_id=cart_id,
            product_id=product_id, 
            quantity=quantity,
            subtotal=subtotal
        )
        db.add(cart_item)
        total_amount += subtotal

    cart.total_amount = total_amount

    db.commit()
    db.refresh(cart)

    return cart


@router.delete(
    path="/{cart_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_cart(
    cart_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cart = db.query(Cart).\
        filter(
            Cart.id == cart_id,
            Cart.user_id == current_user.id
        ).\
        first()

    if not cart:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Cart with id: {cart_id} does not exist!"
        )

    db.delete(cart)
    db.commit()

    return
