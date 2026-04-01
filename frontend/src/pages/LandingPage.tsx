import { CurrencyIcon, GoalIcon, TrendingUpDown } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 flex items-center justify-end  h-16 px-8 bg-white shadow-sm">

        <Button onClick={() => navigate('/login')}>Login</Button>
      </nav>

      {/* Hero Section */}
      <section className="relative px-8 py-24 md:pb-36 overflow-hidden">
        {/* Background gradient blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -z-10"></div>
        <div className="absolute -bottom-8 left-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -z-10"></div>

        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-6 inline-block px-4 py-2 bg-primary-50 rounded-full border border-primary-200">
            <span className="text-sm font-semibold text-primary-700"> Smart Financial Management</span>
          </div>

          <h1 className="mb-6 text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
            Master Your <span className="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">Finances</span>
          </h1>

          <p className="mb-10 text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Take control of your income and expenses with powerful financial tracking and analytics. Make smarter decisions every day.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-primary-500/30 transform hover:-translate-y-1 transition-all duration-200"
            >
              Get Started Free →
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transform hover:-translate-y-1 transition-all duration-200"
            >
              View Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-8 py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-4xl md:text-5xl font-bold text-gray-900">Why Choose Finance Dashboard?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to take control of your financial future
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl hover:shadow-primary-500/10 transform hover:-translate-y-2 transition-all duration-300 border border-gray-100">
              <div className="mb-6 w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-50 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300">
                <CurrencyIcon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">Expense Tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                Easily log and categorize your expenses to understand exactly where your money goes every month
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl hover:shadow-blue-500/10 transform hover:-translate-y-2 transition-all duration-300 border border-gray-100">
              <div className="mb-6 w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300">
                <TrendingUpDown className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">Analytics & Insights</h3>
              <p className="text-gray-600 leading-relaxed">
                Get detailed reports and beautiful visualizations to make informed financial decisions
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl hover:shadow-green-500/10 transform hover:-translate-y-2 transition-all duration-300 border border-gray-100">
              <div className="mb-6 w-16 h-16 bg-gradient-to-br from-green-100 to-green-50 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300">
                <GoalIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">Goal Setting</h3>
              <p className="text-gray-600 leading-relaxed">
                Set and track financial goals to stay motivated and achieve your financial objectives
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-8 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-4xl md:text-5xl font-bold text-gray-900">Get Started in 4 Steps</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From signup to insights in minutes
            </p>
          </div>

          <div className="relative">
            {/* Connector line (hidden on mobile) */}
            <div className="hidden md:block absolute top-8 left-8 right-8 h-1 bg-gradient-to-r from-primary-500 via-primary-400 to-primary-500"></div>

            <div className="grid gap-8 md:grid-cols-4 relative z-10">
              {/* Step 1 */}
              <div className="text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white border-4 border-primary-500 text-2xl font-bold text-primary-600 mx-auto shadow-lg">
                  1
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Sign Up</h3>
                <p className="text-gray-600">Create your account in seconds with your email</p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white border-4 border-primary-500 text-2xl font-bold text-primary-600 mx-auto shadow-lg">
                  2
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Add Records</h3>
                <p className="text-gray-600">Log your income and expenses effortlessly</p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white border-4 border-primary-500 text-2xl font-bold text-primary-600 mx-auto shadow-lg">
                  3
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Visualize</h3>
                <p className="text-gray-600">View detailed analytics and spending trends</p>
              </div>

              {/* Step 4 */}
              <div className="text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-primary-500 text-2xl font-bold text-white mx-auto shadow-lg">
                  4
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Improve</h3>
                <p className="text-gray-600">Make smarter financial decisions daily</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-8 py-20 bg-gradient-to-r from-primary-600 to-primary-500">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-3 text-center text-white">
            <div>
              <div className="mb-2 text-5xl font-bold">10K+</div>
              <p className="text-primary-100 font-bold">Active Users</p>
            </div>
            <div>
              <div className="mb-2 text-5xl font-bold">$1B+</div>
              <p className="text-primary-100 font-bold">Transactions Tracked</p>
            </div>
            <div>
              <div className="mb-2 text-5xl font-bold">98%</div>
              <p className="text-primary-100 font-bold">User Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="px-8 py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 text-4xl md:text-5xl font-bold text-gray-900">Ready to Take Control?</h2>
          <p className="mb-10 text-xl text-gray-600">
            Join thousands of users managing their finances smarter today. Start for free, no credit card required.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-10 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-primary-500/30 transform hover:-translate-y-1 transition-all duration-200 text-lg"
          >
            Start Your Free Trial Now →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 px-8 py-12 text-center text-gray-400 border-t border-gray-800">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4">&copy; 2026. All rights reserved.</p>
          <div className="flex gap-6 justify-center text-sm">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
