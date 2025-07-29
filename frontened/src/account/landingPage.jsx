import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaMousePointer, FaBox, FaCloudDownloadAlt, FaLightbulb, FaLock, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

export default function LandingPage({ setSignin }) {
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white text-slate-800 flex flex-col">
      {/* Modern Header */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md py-3 shadow-sm' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-3"
          >
            <div className="bg-indigo-500 w-10 h-10 rounded-lg flex items-center justify-center">
              <FaBox className="text-white text-xl" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              ImageMark Studio
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <button
              onClick={() => setSignin(true)}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center group shadow-sm"
            >
              Get Started
              <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </header>

      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="relative text-center py-24 px-6">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-indigo-100 filter blur-[100px]"></div>
            <div className="absolute top-1/2 right-1/4 w-48 h-48 rounded-full bg-purple-100 filter blur-[90px]"></div>
          </div>
          
          <div className="max-w-4xl mx-auto relative z-10">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-extrabold mb-6"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
                Precision Annotation
              </span> <br />
              <span className="text-slate-900">for Computer Vision</span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-slate-600 max-w-2xl mx-auto mb-10"
            >
              Create accurate bounding boxes with our intuitive platform designed for machine learning professionals.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <button
                onClick={() => window.location.href="/signin"}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30"
              >
                Start Labeling
              </button>
              <button
                onClick={() => window.location.href="#features"}
                className="bg-white hover:bg-slate-50 text-slate-900 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 border border-slate-200 shadow-sm"
              >
                View Features
              </button>
            </motion.div>
          </div>
        </section>

        {/* Bounding Box Demo */}
        <section className="py-16 bg-slate-100">
          <div className="max-w-5xl mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative bg-white rounded-2xl p-1 border border-slate-200 overflow-hidden shadow-sm"
            >
              <div className="relative h-96 rounded-xl overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white"></div>
                <div className="relative z-10">
                  <div className="relative w-80 h-56 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300">
                    {/* Demo bounding boxes */}
                    <div className="absolute top-8 left-8 w-24 h-32 border-2 border-green-500 rounded">
                      <div className="absolute -top-6 left-0 bg-green-500 text-xs text-white px-2 py-1 rounded">Person</div>
                    </div>
                    <div className="absolute top-12 right-12 w-16 h-16 border-2 border-blue-500 rounded">
                      <div className="absolute -top-6 left-0 bg-blue-500 text-xs text-white px-2 py-1 rounded">Car</div>
                    </div>
                    <div className="absolute bottom-10 left-16 w-20 h-20 border-2 border-purple-500 rounded-full">
                      <div className="absolute -top-6 left-0 bg-purple-500 text-xs text-white px-2 py-1 rounded">Ball</div>
                    </div>
                    
                    {/* Animated cursor */}
                    <motion.div 
                      className="absolute top-1/2 left-1/2 w-8 h-8 rounded-full border-2 border-indigo-500"
                      animate={{ 
                        x: ["-50%", "-50%", "-50%", "-50%"],
                        y: ["-50%", "-50%", "-50%", "-50%"],
                        scale: [1, 1.2, 1, 1.2]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    >
                      <div className="absolute top-0 left-0 w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>
                    </motion.div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm text-sm px-3 py-1.5 rounded-lg border border-slate-200">
                <span className="text-green-500">●</span> Real-time annotation preview
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl md:text-4xl font-bold mb-4 text-slate-900"
              >
                Advanced Annotation Features
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-xl text-slate-600 max-w-3xl mx-auto"
              >
                Everything you need to create high-quality training datasets
              </motion.p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-400 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div className="bg-indigo-100 w-14 h-14 rounded-lg flex items-center justify-center mb-5">
                  <FaMousePointer className="text-3xl text-indigo-600" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-slate-900">Intuitive Interface</h4>
                <p className="text-slate-600">
                  Drag, resize, and label bounding boxes with pixel-perfect precision using our optimized annotation tools.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-400 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div className="bg-purple-100 w-14 h-14 rounded-lg flex items-center justify-center mb-5">
                  <FaLightbulb className="text-3xl text-purple-600" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-slate-900">AI-Assisted Labeling</h4>
                <p className="text-slate-600">
                  Our smart tools predict bounding boxes, reducing annotation time by up to 70%.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-400 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-5">
                  <FaCloudDownloadAlt className="text-3xl text-blue-600" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-slate-900">Flexible Export</h4>
                <p className="text-slate-600">
                  Export in COCO, Pascal VOC, YOLO, or custom formats. Seamless integration with TensorFlow and PyTorch.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-400 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div className="bg-green-100 w-14 h-14 rounded-lg flex items-center justify-center mb-5">
                  <FaBox className="text-3xl text-green-600" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-slate-900">Dataset Management</h4>
                <p className="text-slate-600">
                  Organize projects, manage collaborators, and track annotation progress in one place.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-400 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div className="bg-pink-100 w-14 h-14 rounded-lg flex items-center justify-center mb-5">
                  <FaCheckCircle className="text-3xl text-pink-600" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-slate-900">Quality Control</h4>
                <p className="text-slate-600">
                  Built-in validation tools to ensure annotation consistency and accuracy across your entire dataset.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-400 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div className="bg-yellow-100 w-14 h-14 rounded-lg flex items-center justify-center mb-5">
                  <FaLock className="text-3xl text-yellow-600" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-slate-900">Enterprise Security</h4>
                <p className="text-slate-600">
                  SOC 2 compliant with encrypted data storage and strict access controls for sensitive projects.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-slate-100">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl md:text-4xl font-bold mb-4 text-slate-900"
              >
                Simple Workflow, Professional Results
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-xl text-slate-600 max-w-3xl mx-auto"
              >
                From raw images to training-ready datasets in minutes
              </motion.p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8 relative">
              <div className="absolute top-12 left-1/4 right-1/4 h-1 bg-gradient-to-r from-indigo-300 to-purple-300 hidden md:block"></div>
              
              {[
                { number: 1, title: "Upload Images", desc: "Drag and drop your images or connect to cloud storage", color: "bg-indigo-500" },
                { number: 2, title: "Draw Boxes", desc: "Create bounding boxes around objects with our smart tools", color: "bg-purple-500" },
                { number: 3, title: "Add Labels", desc: "Assign accurate class labels to each annotation", color: "bg-pink-500" },
                { number: 4, title: "Export Dataset", desc: "Download your dataset in the format you need", color: "bg-blue-500" }
              ].map((step, index) => (
                <motion.div 
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center relative z-10"
                >
                  <div className={`${step.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl shadow-md`}>
                    {step.number}
                  </div>
                  <h4 className="text-xl font-semibold mb-2 text-slate-900">{step.title}</h4>
                  <p className="text-slate-600">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="bg-gradient-to-br from-white to-slate-50 rounded-3xl p-12 border border-slate-200 shadow-lg"
            >
              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">
                Ready to Accelerate Your Computer Vision Projects?
              </h3>
              <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
                Join thousands of ML engineers and researchers who use ImageMark Studio to create better datasets faster.
              </p>
              <button
                onClick={() => setSignin(true)}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30"
              >
                Start Free Trial
              </button>
              <p className="mt-6 text-slate-500">No credit card required • 14-day free trial</p>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Modern Footer */}
      <footer className="bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-indigo-500 w-8 h-8 rounded-lg flex items-center justify-center">
                  <FaBox className="text-white text-sm" />
                </div>
                <h1 className="text-xl font-bold text-white">
                  ImageMark Studio
                </h1>
              </div>
              <p className="text-slate-400 text-sm">
                Precision annotation tools for computer vision professionals.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-slate-200">Product</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition">Roadmap</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-slate-200">Resources</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition">Tutorials</a></li>
                <li><a href="#" className="hover:text-white transition">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition">Community</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-slate-200">Company</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-600 text-sm">
              © {new Date().getFullYear()} ImageMark Studio. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-500 hover:text-white transition">Terms</a>
              <a href="#" className="text-slate-500 hover:text-white transition">Privacy</a>
              <a href="#" className="text-slate-500 hover:text-white transition">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}