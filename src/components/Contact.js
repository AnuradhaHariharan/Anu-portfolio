import React, { useState } from 'react';
import "../styles/Contact.css";
import FadeInSection from "./FadeInSection";
import { FaPhone, FaEnvelope } from 'react-icons/fa';
import { useForm, ValidationError } from '@formspree/react';
import Modal from './Modal'; // Import the Modal component
import ShiningButton from './Badge';

function Contact() {
    const [state, handleSubmit] = useForm("xldrbgpo"); // Replace with your Formspree ID
    const [modalOpen, setModalOpen] = useState(false); // Track modal visibility
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleChange = (e) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        handleSubmit(event).then(() => {
            setFormState({ name: "", email: "", message: "" }); // Clear form fields
            setModalOpen(true); // Open the modal on successful submission
        });
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    return (
        <div id="contact">
             <div className="shining-button-container">
          <ShiningButton>CONTACT</ShiningButton>
        </div>
            <FadeInSection>
                <div className="contact-container">
                    <h2>Get in Touch</h2>
                    <div className="contact-details">
                        <div className="contact-item">
                            <a href="https://wa.me/918925419205" className="contact-info-text">
                                <FaPhone className="contact-icon" />
                                &nbsp; +91 8925419205
                            </a>
                        </div>
                        <div className="contact-item">
                            <a href="mailto:anuradhahariharannov5@gmail.com" className="contact-info-text">
                                <FaEnvelope className="contact-icon" />
                                &nbsp; anuradhahariharannov5@gmail.com
                            </a>
                        </div>
                    </div>

                    <form onSubmit={handleFormSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formState.name}
                                onChange={handleChange}
                                placeholder="Name"
                                className="form-group__input"
                            />
                            <label htmlFor="name" className="form-group__label">Name</label>
                            <ValidationError
                                prefix="Name"
                                field="name"
                                errors={state.errors}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formState.email}
                                onChange={handleChange}
                                placeholder="Email"
                                className="form-group__input"
                            />
                            <label htmlFor="email" className="form-group__label">Email</label>
                            <ValidationError
                                prefix="Email"
                                field="email"
                                errors={state.errors}
                            />
                        </div>
                        <div className="form-group">
                            <textarea
                                id="message"
                                name="message"
                                value={formState.message}
                                onChange={handleChange}
                                placeholder="Message"
                                className="form-group__input"
                            />
                            <label htmlFor="message" className="form-group__label">Message</label>
                            <ValidationError
                                prefix="Message"
                                field="message"
                                errors={state.errors}
                            />
                        </div>
                        <button type="submit" className="submit-button" disabled={state.submitting}>
                            Hit me up
                            <img src={`${process.env.PUBLIC_URL}/assets/rocket.png`} alt="Rocket Icon" className="rocket-icon" />
                        </button>
                    </form>
                </div>
            </FadeInSection>
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
        </div>
    );
}

export default Contact;