"use client";

import { useState } from 'react';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';

const Form = () => {
    const [name, setName] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const [ageResponse, genderResponse, countryResponse] = await Promise.all([
                axios.get(`https://api.agify.io/?name=${name}`),
                axios.get(`https://api.genderize.io/?name=${name}`),
                axios.get(`https://api.nationalize.io/?name=${name}`)
            ]);

            setResult({
                age: ageResponse.data.age,
                gender: genderResponse.data.gender,
                country: countryResponse.data.country[0]?.country_id || 'Unknown',
            });
        } catch (error) {
            setError(`Failed to fetch data : ${error.response.data.error}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <div className="text-center mb-8">
                <h1 className="text-5xl font-extrabold mb-4 text-gray-800 tracking-wide">Name Guesser</h1>
                <p className="text-gray-600">Enter a name to guess the age, gender, and country.</p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4 w-full max-w-md bg-white p-8 rounded-lg shadow-xl transform transition-all duration-500 hover:shadow-2xl">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter a name"
                    className="p-3 border border-gray-300 rounded w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                />
                <button
                    type="submit"
                    className="p-3 bg-blue-600 text-white rounded w-full transition duration-300 ease-in-out transform hover:bg-blue-700 hover:scale-105"
                >
                    Guess
                </button>
            </form>
            {loading && (
                <div className="mt-4 text-blue-600 flex items-center space-x-2">
                    <FaSpinner className="animate-spin" />
                    <span>Loading...</span>
                </div>
            )}
            {error && <p className="mt-4 text-red-500">{error}</p>}
            {result && (
                <div className="mt-8 p-6 bg-white rounded-lg shadow-xl w-full max-w-md text-gray-800">
                    <p className="text-xl font-semibold"><strong>Age:</strong> {result.age}</p>
                    <p className="text-xl font-semibold"><strong>Gender:</strong> {result.gender.toUpperCase()}</p>
                    <p className="text-xl font-semibold"><strong>Country:</strong> {result.country}</p>
                </div>
            )}
        </div>
    );
};

export default Form;
