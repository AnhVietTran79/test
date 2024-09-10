// controllers/cartController.js
const Event = require('../models/eventModel'); // Import the Event model
const User = require('../models/userModel'); // Import the User model
const mongoose = require('mongoose');
const Cart = require('../models/cartModel');

//show product page
const loadProduct = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        res.render('product', { event });
    } catch (error) {
        console.error('Error loading product:', error);
        res.status(500).send('Server error');
    }
};

const loadConfirmation = async (req, res) => {
    try {
        res.render('confirm');
    } catch (error) {
        console.error('Error loading confirmation:', error);
        res.status(500).send('Server error');
    }
}

//add product to cart
const addToCart = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const eventId = req.body.eventId;
        const quantity = parseInt(req.body.quantity, 10) || 1;

        console.log('User ID:', userId);
        console.log('Event ID:', eventId);
        console.log('Quantity:', quantity);

        // Find the existing cart item for the user and event
        let cartItem = await Cart.findOne({ user: userId, event: eventId });

        if (cartItem) {
            // Update the quantity if the event is already in the cart
            console.log('Event already in cart, updating quantity');
            cartItem.quantity += quantity;
        } else {
            // Create a new cart item if it doesn't exist
            console.log('Adding new event to cart');
            cartItem = new Cart({ user: userId, event: eventId, quantity });
        }

        await cartItem.save();
        console.log('Cart saved successfully');
        res.redirect('/cart/confirm');  // Redirect or render a confirmation page
    } catch (error) {
        console.error('Error in addToCart:', error);
        res.status(500).send('Internal Server Error');
    }
};

const getUserEvents = async (req, res) => {
    try {
        const userId = req.session.user_id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send('Invalid User ID.');
        }

        // Find all cart items for the user and populate event details
        const cartItems = await Cart.find({ user: userId }).populate('event');

        if (cartItems.length === 0) {
            return res.status(404).send('No events found for this user.');
        }

        // Map cartItems to include event details
        const mappedCartItems = cartItems.map(item => ({
            id: item._id,
            name: item.event.name,
            description: item.event.description,
            price: item.event.price,
            quantity: item.quantity,
            createdAt: item.createdAt
        }));

        res.render('userEvents', { cartItems: mappedCartItems });
    } catch (error) {
        console.error('Error in getUserEvents:', error);
        res.status(500).send('Internal Server Error');
    }
};

const deleteCartItem = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const itemId = req.body.itemId;

        if (!itemId) {
            return res.status(400).send('Item ID is required');
        }

        // Ensure the user ID is logged correctly
        console.log('User ID:', userId);
        console.log('Item ID:', itemId);
        
        // Find and remove the cart item directly
        const result = await Cart.findByIdAndDelete(itemId);

        if (!result) {
            return res.status(404).send('Item not found in cart');
        }

        res.redirect('/cart/userEvents'); // Redirect to the userEvents page
    } catch (error) {
        console.error('Error in deleteCartItem:', error);
        res.status(500).send('Internal Server Error');
    }
};


module.exports = {
    loadProduct,
    loadConfirmation,
    addToCart,
    getUserEvents,
    deleteCartItem
};

  

