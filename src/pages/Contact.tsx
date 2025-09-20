import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import OurAim from "./OurAim";

interface ContactFormInputs {
    name: string;
    email: string;
    tel: string;
    message: string;
    source: string;
}

const ContactUs: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ContactFormInputs>();

    const onSubmit: SubmitHandler<ContactFormInputs> = async (data) => {
        const userInfo = {
            access_key: "d530b0bf-0634-424f-9036-edea05f6d33a",
            name: data.name,
            email: data.email,
            tel: data.tel,
            message: data.message,
            source: data.source,
        };

        try {
            await axios.post("https://api.web3forms.com/submit", userInfo, {
                headers: { "Content-Type": "application/json" },
            });
            toast.success("Form submitted successfully!");
        } catch (error) {
            toast.error("Failed to submit the form. Please try again later.");
        }
    };

    return (
        <section className="bg-[#f4f6fb] py-12 px-4 md:px-20">
            <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row">
                {/* Contact Form */}
                <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold mb-1">
                        <span className="text-black">Get in </span>
                        <span className="text-purple-600">Touch</span>
                    </h2>
                    <p className="text-gray-600 mb-6">
                        We'd love to hear from you! Whether you have a question, need
                        assistance, or want to collaborate with us, feel free to reach out.
                    </p>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                        noValidate
                    >
                        <input
                            type="text"
                            placeholder="Your Name"
                            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            {...register("name", { required: "Name is required" })}
                        />
                        {errors.name && (
                            <span className="text-red-500 text-sm">
                                {errors.name.message}
                            </span>
                        )}

                        <input
                            type="email"
                            placeholder="Your Email"
                            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            {...register("email", { required: "Email is required" })}
                        />
                        {errors.email && (
                            <span className="text-red-500 text-sm">
                                {errors.email.message}
                            </span>
                        )}

                        <input
                            type="tel"
                            placeholder="Phone Number"
                            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            {...register("tel", { required: "Phone number is required" })}
                        />
                        {errors.tel && (
                            <span className="text-red-500 text-sm">
                                {errors.tel.message}
                            </span>
                        )}

                        <select
                            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            {...register("source", { required: "Please select a source" })}
                        >
                            <option value="">How did you find us?</option>
                            <option value="Google">Google</option>
                            <option value="Instagram">Instagram</option>
                            <option value="Facebook">Facebook</option>
                            <option value="Referral">Referral</option>
                            <option value="Other">Other</option>
                        </select>
                        {errors.source && (
                            <span className="text-red-500 text-sm">
                                {errors.source.message}
                            </span>
                        )}

                        <textarea
                            placeholder="Your Message"
                            rows={4}
                            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            {...register("message", { required: "Message is required" })}
                        />
                        {errors.message && (
                            <span className="text-red-500 text-sm">
                                {errors.message.message}
                            </span>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 transition"
                        >
                            Send Message
                        </button>
                    </form>

                    {/* Social Media Icons */}
                    <div className="flex justify-center gap-6 mt-8 text-purple-600 text-2xl">
                        <a
                            href="https://www.facebook.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <i className="fab fa-facebook"></i>
                        </a>
                        <a
                            href="https://twitter.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <i className="fab fa-x-twitter"></i>
                        </a>
                        <a
                            href="https://www.instagram.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <i className="fab fa-instagram"></i>
                        </a>
                    </div>
                </div>

                {/* Engineering Quotes Section */}
                <div className="w-full md:w-1/2 bg-gradient-to-br from-purple-50 to-purple-100 flex flex-col justify-center p-10">
                    <h3 className="text-2xl font-bold text-purple-700 mb-6 text-center">
                        Inspiring Engineering Thoughts
                    </h3>
                    <div className="space-y-6">
                        {[
                            "“Engineering is not just about solving problems, it’s about shaping the future.” 🚀",
                            "“Every great engineer was once a student who refused to give up.” 💡",
                            "“Failures are just prototypes for success.” ⚙️",
                            "“Your projects define your passion — build, break, and rebuild until it works.” 🔧",
                            "“Dream big, work hard, and let innovation be your signature.” ✨",
                        ].map((quote, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition"
                            >
                                <p className="text-gray-700 italic">{quote}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Team Section */}
            {/* <div className="mt-20 bg-[#f7f8fa] text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-10">
                    MEET OUR BEST TEAM
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 place-items-center">
                    {[
                        { name: "Vivek Pandey", img: "../images/vivek.avif", link: "https://vp5846113.wixstudio.com/portfolio"},
                        { name: "Omkar Chandra", img: "../images/Omkar.jpg" },
                        { name: "Shreyansh Rai", img: "../images/Shreyansh1.jpg" },
                        { name: "Sagar Gupta", img: "../images/Sagar.jpg" },
                        { name: "Zaeem Pathan", img: "/images/team4.jpg" },
                        { name: "Taruna Gupta", img: "/images/team4.jpg" },
                    ].map((member) => (
                        <div
                            key={member.name}
                            className="transition-transform duration-300 hover:scale-105"
                        >
                            <a
                                key={member.name}
                                href={member.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition-transform duration-300 hover:scale-105 text-center"
                            >
                            <img
                                src={member.img}
                                alt={member.name}
                                className="w-40 h-40 object-cover rounded-full shadow-lg transition-shadow duration-300 hover:shadow-xl"
                                loading="lazy"
                            />
                            <p className="mt-4 text-lg font-semibold text-gray-800 hover:text-purple-600 hover:underline transition duration-300 cursor-pointer">
                                {member.name}
                            </p>
                            </a>
                        </div>
                    ))}
                </div>
            </div> */}
            < OurAim />
        </section>
    );
};

export default ContactUs;
