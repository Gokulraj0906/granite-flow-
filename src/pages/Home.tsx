import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Sparkles, 
  Settings, 
  TimerReset, 
  Workflow, 
  ShieldCheck, 
  Zap,
  CheckCircle,
  BarChart3,
  Users,
  Clock,
  ArrowRight,
  Star,
  TrendingUp,
  Award,
  Target,
  Layers,
  Menu,
  X,
} from "lucide-react";

export default function GraniteFlowLanding() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({
    about: false,
    features: false,
    benefits: false,
    testimonials: false,
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      setIsVisible(prev => ({
        ...prev,
        [entry.target.id]: entry.isIntersecting
      }));
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1
    });

    document.querySelectorAll('[data-animate]').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const features = [
    {
      icon: Settings,
      title: "Complete Process Control",
      description: "Full administrative control over every granite processing stage. Assign, reassign, and reorder tasks with unprecedented flexibility and precision."
    },
    {
      icon: TimerReset,
      title: "Intelligent Backlog Detection",
      description: "Advanced algorithms automatically detect overdue orders and intelligently reschedule them, preventing bottlenecks and ensuring smooth operations."
    },
    {
      icon: Workflow,
      title: "Smart Deadline Prioritization",
      description: "AI-powered prioritization system that dynamically sorts orders based on deadlines, urgency, and resource availability for optimal efficiency."
    },
    {
      icon: ShieldCheck,
      title: "Enterprise Security",
      description: "Military-grade role-based access control ensures only authorized personnel can modify workflows and access sensitive operational data."
    },
    {
      icon: Zap,
      title: "Real-time Synchronization",
      description: "Lightning-fast updates across all devices and workstations. Changes propagate instantly, keeping your entire team synchronized and informed."
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Comprehensive reporting and analytics dashboard providing deep insights into production efficiency, bottlenecks, and performance metrics."
    }
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: "300% Efficiency Increase",
      description: "Average productivity boost achieved by our clients within the first month of implementation."
    },
    {
      icon: Clock,
      title: "99.8% On-Time Delivery",
      description: "Exceptional delivery performance through intelligent scheduling and automated workflow management."
    },
    {
      icon: Award,
      title: "Zero Training Required",
      description: "Intuitive interface designed for immediate adoption without extensive training programs."
    },
    {
      icon: Target,
      title: "Complete Visibility",
      description: "Real-time visibility into every aspect of your granite processing operation from raw material to finished product."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Operations Manager",
      company: "Premier Granite Works",
      content: "Aurelion's Granite Flow system revolutionized our operations. We went from constant delays to consistently beating our delivery targets.",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "Production Director",
      company: "Mountain Stone Industries",
      content: "The automated backlog detection alone saved us thousands in overtime costs. This system pays for itself within weeks.",
      rating: 5
    },
    {
      name: "Emma Thompson",
      role: "Factory Supervisor",
      company: "Precision Stone Co.",
      content: "Finally, a system that understands the complexity of granite processing. Our workers love how simple and intuitive it is.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white overflow-hidden">
      {/* Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-gray-900/95 backdrop-blur-md border-b border-gray-800/50 shadow-2xl' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => scrollToSection('hero')}
            >
              <div className="p-2 rounded-xl bg-gradient-to-br from-teal-500/20 to-purple-500/20 group-hover:from-teal-500/30 group-hover:to-purple-500/30 transition-all duration-300">
                <Sparkles className="w-6 h-6 text-teal-400" />
              </div>
              <div>
                <div className="text-xl font-bold text-white group-hover:text-teal-300 transition-colors duration-300">
                  Granite Flow
                </div>
                <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  by Aurelion Future Forge
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('features')}
                className="text-gray-300 hover:text-teal-400 transition-colors duration-300 font-medium"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('benefits')}
                className="text-gray-300 hover:text-teal-400 transition-colors duration-300 font-medium"
              >
                Benefits
              </button>
              <button 
                onClick={() => scrollToSection('testimonials')}
                className="text-gray-300 hover:text-teal-400 transition-colors duration-300 font-medium"
              >
                Testimonials
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-gray-300 hover:text-teal-400 transition-colors duration-300 font-medium"
              >
                Contact
              </button>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="border-teal-400/50 text-teal-400 hover:bg-teal-400 hover:text-white transition-all duration-300">
                  <a href="/auth">Login</a>
                </Button>
                <Button className="bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white font-semibold transition-all duration-300 transform hover:scale-105">
                  Free Trial
                </Button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-800/50 transition-colors duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-gray-900/98 backdrop-blur-md border-b border-gray-800/50 shadow-2xl animate-fade-in">
              <div className="px-6 py-6 space-y-4">
                <button 
                  onClick={() => scrollToSection('features')}
                  className="block w-full text-left text-gray-300 hover:text-teal-400 transition-colors duration-300 font-medium py-2"
                >
                  Features
                </button>
                <button 
                  onClick={() => scrollToSection('benefits')}
                  className="block w-full text-left text-gray-300 hover:text-teal-400 transition-colors duration-300 font-medium py-2"
                >
                  Benefits
                </button>
                <button 
                  onClick={() => scrollToSection('testimonials')}
                  className="block w-full text-left text-gray-300 hover:text-teal-400 transition-colors duration-300 font-medium py-2"
                >
                  Testimonials
                </button>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="block w-full text-left text-gray-300 hover:text-teal-400 transition-colors duration-300 font-medium py-2"
                >
                  Contact
                </button>
                <div className="pt-4 border-t border-gray-800 space-y-3">
                  <Button variant="outline" className="w-full border-teal-400/50 text-teal-400 hover:bg-teal-400 hover:text-white transition-all duration-300">
                    Login
                  </Button>
                  <Button className="w-full bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white font-semibold transition-all duration-300">
                    Free Trial
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse"
          style={{ transform: `translateY(${-scrollY * 0.15}px)` }}
        />
      </div>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center px-6 py-20 pt-32">
        <div className="text-center max-w-6xl mx-auto">
          <div 
            className="flex justify-center items-center gap-4 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-400 text-5xl md:text-7xl font-bold mb-6 animate-fade-in"
            style={{ transform: `translateY(${-scrollY * 0.2}px)` }}
          >
            <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-teal-400" />
            Granite Flow
          </div>
          
          <h1 className="text-2xl md:text-3xl text-gray-300 mb-8 animate-fade-in-delay-1">
            Revolutionary Factory Management System
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-4xl mx-auto mb-12 leading-relaxed animate-fade-in-delay-2">
            Transform your granite processing operation with intelligent automation, real-time tracking, and predictive analytics. 
            Join industry leaders who've increased their efficiency by 300% and achieved 99.8% on-time delivery rates.
          </p>
          
          <div className="flex justify-center gap-6 flex-wrap animate-fade-in-delay-3">
            <Button className="bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-teal-500/25 transition-all duration-300 transform hover:scale-105">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" className="border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105">
              Watch Demo
            </Button>
          </div>

          <div className="mt-16 flex justify-center gap-8 text-sm text-gray-500 animate-fade-in-delay-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-teal-400" />
              No Credit Card Required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-teal-400" />
              14-Day Free Trial
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-teal-400" />
              Setup in Minutes
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section 
        id="about" 
        data-animate
        className={`py-20 px-6 transition-all duration-1000 ${isVisible.about ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
              The Granite Industry's Biggest Challenge
            </h2>
            <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
              95% of granite processing facilities struggle with inefficient workflows, missed deadlines, and poor visibility into their operations. 
              Traditional methods lead to chaos, costly delays, and frustrated customers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-red-900/20 to-red-800/10 border border-red-500/20">
              <div className="text-3xl font-bold text-red-400 mb-2">73%</div>
              <p className="text-gray-400">of orders delivered late</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-orange-900/20 to-orange-800/10 border border-orange-500/20">
              <div className="text-3xl font-bold text-orange-400 mb-2">$50K+</div>
              <p className="text-gray-400">average annual losses</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 border border-yellow-500/20">
              <div className="text-3xl font-bold text-yellow-400 mb-2">40%</div>
              <p className="text-gray-400">of time wasted on coordination</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-500/20">
              <div className="text-3xl font-bold text-purple-400 mb-2">60%</div>
              <p className="text-gray-400">of factories lack proper tracking</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        id="features" 
        data-animate
        className={`py-20 px-6 transition-all duration-1000 delay-200 ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-400">
              Powerful Features Built for Granite Processing
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Every feature designed specifically for the unique challenges of granite manufacturing and processing workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index}
                  className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 border-gray-700/50 backdrop-blur-sm hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 group"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500/20 to-purple-500/20 group-hover:from-teal-500/30 group-hover:to-purple-500/30 transition-all duration-300">
                        <Icon className="h-6 w-6 text-teal-400 group-hover:text-teal-300 transition-colors duration-300" />
                      </div>
                      <CardTitle className="text-xl text-white group-hover:text-teal-300 transition-colors duration-300">
                        {feature.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section 
        id="benefits" 
        data-animate
        className={`py-20 px-6 bg-gradient-to-r from-gray-900/50 to-gray-800/50 transition-all duration-1000 delay-400 ${isVisible.benefits ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Proven Results That Transform Businesses
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Join hundreds of granite processing facilities that have revolutionized their operations with measurable results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div 
                  key={index}
                  className="text-center p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-teal-500/50 transition-all duration-500 transform hover:scale-105 group"
                >
                  <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-teal-500/20 to-purple-500/20 mb-6 group-hover:from-teal-500/30 group-hover:to-purple-500/30 transition-all duration-300">
                    <Icon className="h-8 w-8 text-teal-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-teal-300 transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section 
        id="testimonials" 
        data-animate
        className={`py-20 px-6 transition-all duration-1000 delay-600 ${isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-gray-400">
              Don't just take our word for it. Here's what our clients say about their transformation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index}
                className="bg-gradient-to-br from-gray-900/60 to-gray-800/30 border-gray-700/50 backdrop-blur-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-500 transform hover:scale-105"
              >
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 italic leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="border-t border-gray-700 pt-4">
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-teal-400 text-sm">{testimonial.role}</div>
                    <div className="text-gray-500 text-sm">{testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-teal-900/30 to-purple-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to Transform Your Granite Processing?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Join the granite processing revolution. Start your free trial today and experience the power of intelligent workflow management.
          </p>
          
          <div className="flex justify-center gap-6 flex-wrap mb-12">
            <Button className="bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white px-10 py-5 text-xl font-semibold rounded-full shadow-2xl hover:shadow-teal-500/25 transition-all duration-300 transform hover:scale-105">
              Start Your Free Trial
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
            <Button variant="secondary" className="border-2 border-white text-black hover:bg-white hover:text-gray-900 px-10 py-5 text-xl font-semibold rounded-full transition-all duration-300 transform hover:scale-105">
              Schedule Demo
            </Button>
          </div>

          <div className="flex justify-center items-center gap-8 text-gray-400">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>500+ Happy Clients</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              <span>1M+ Orders Processed</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              <span>Industry Leader</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900/80 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center items-center gap-3 text-teal-400 text-2xl font-bold mb-4">
              <Sparkles className="w-6 h-6" />
              Aurelion Future Forge
            </div>
            <p className="text-gray-400 mb-6">
              Pioneering the future of industrial automation and smart manufacturing solutions.
            </p>
            <div className="text-sm text-gray-500">
              © 2025 Aurelion Future Forge. All rights reserved. | Built for the future of granite processing.
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-fade-in-delay-1 {
          animation: fade-in 1s ease-out 0.2s both;
        }
        
        .animate-fade-in-delay-2 {
          animation: fade-in 1s ease-out 0.4s both;
        }
        
        .animate-fade-in-delay-3 {
          animation: fade-in 1s ease-out 0.6s both;
        }
        
        .animate-fade-in-delay-4 {
          animation: fade-in 1s ease-out 0.8s both;
        }
      `}</style>
    </div>
  );
}