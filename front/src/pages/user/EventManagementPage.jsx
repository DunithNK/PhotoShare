import React, { useState, useEffect, useRef } from 'react';
import { User, Bell, MessageSquare } from 'lucide-react';

// Main App Component
export default function EventPhotoApp() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-4 py-5">
        <HeroSection />
        <UpcomingOnlineEvents />
        <UpcomingPhysicalEvents />
        <OrganizersSlider />
      </main>
    </div>
  );
}



// Hero Section Component
function HeroSection() {
  return (
    <section>
      <h1 className="text-2xl font-bold my-5">Manage Your Events with Ease</h1>
      <div className="flex flex-col md:flex-row items-center mb-10">
        <div className="md:pr-5 mb-5 md:mb-0 flex-1">
          <p className="mb-3">Plan, organize, and track your online photography classes and workshops - all in one place.</p>
          <p>Our event management system lets you schedule sessions, manage attendees, and streamline your course delivery effortlessly.</p>
        </div>
        <div className="flex-1 overflow-hidden rounded-lg">
          <img 
            src="/api/placeholder/600/400" 
            alt="Photography event" 
            className="w-full h-auto transition-transform duration-500 hover:scale-105"
          />
        </div>
      </div>
    </section>
  );
}

// Event Card Component
function EventCard({ image, title, description, buttonText }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <img 
        className="w-full h-44 object-cover" 
        src={image} 
        alt={title} 
      />
      <div className="p-4">
        <h3 className="text-base font-medium mb-2">{title}</h3>
        <p className="text-xs text-gray-600 mb-2">{description}</p>
        {buttonText && (
          <a href="#" className="inline-block bg-gray-100 px-3 py-1 rounded text-xs text-gray-700 hover:bg-gray-200 transition-colors">
            {buttonText}
          </a>
        )}
      </div>
    </div>
  );
}



// Upcoming Events Component
function UpcomingOnlineEvents() {
  const events = Array(6).fill({
    image: "/api/placeholder/300/200",
    title: "Mastering Photography: From Basics to Pro",
    description: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the standard dummy text ever since the 1500s."
  });

  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold my-5">Upcoming online events</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {events.map((event, index) => (
          <EventCard key={index} {...event} />
        ))}
      </div>
    </section>
  );
}

function UpcomingPhysicalEvents() {
    const events = Array(6).fill({
      image: "/api/placeholder/300/200",
      title: "Mastering Photography: From Basics to Pro",
      description: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the standard dummy text ever since the 1500s."
    });
  
    return (
      <section className="mb-10">
        <h2 className="text-xl font-bold my-5">Upcoming physical events</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((event, index) => (
            <EventCard key={index} {...event} />
          ))}
        </div>
      </section>
    );
  }
  

// City Card Component
function CityCard({ image, name }) {
  return (
    <div className="min-w-[350px] h-[200px] mr-5 relative rounded-lg overflow-hidden">
      <img 
        src={image} 
        alt={name} 
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-5 left-5 text-white text-2xl font-bold drop-shadow-lg">
        {name}
      </div>
    </div>
  );
}

// Generic Slider Hook
function useSlider(itemWidth, itemCount, containerRef) {
  const [position, setPosition] = useState(0);
  const [maxPosition, setMaxPosition] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      setMaxPosition(-(itemWidth * itemCount - containerWidth));
    }
  }, [containerRef, itemWidth, itemCount]);

  const handlePrev = () => {
    const newPosition = position + itemWidth;
    setPosition(Math.min(0, newPosition));
  };

  const handleNext = () => {
    const newPosition = position - itemWidth;
    setPosition(Math.max(maxPosition, newPosition));
  };

  return { position, handlePrev, handleNext };
}

// Cities Slider Component
function CitiesSlider() {
  const containerRef = useRef(null);
  const cities = [
    { name: "Nuwara Eliya", image: "/api/placeholder/350/200" },
    { name: "Galle", image: "/api/placeholder/350/200" },
    { name: "Colombo", image: "/api/placeholder/350/200" },
    { name: "Kandy", image: "/api/placeholder/350/200" }
  ];
  
  const { position, handlePrev, handleNext } = useSlider(370, cities.length, containerRef);

  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold my-5">Best Cities for Hosting Events</h2>
      <div className="relative overflow-hidden" ref={containerRef}>
        <button 
          className="absolute top-1/2 left-2 -translate-y-1/2 w-10 h-10 bg-white/70 rounded-full flex items-center justify-center z-10 hover:bg-white/90 transition-colors"
          onClick={handlePrev}
        >
          &#10094;
        </button>
        <div 
          className="flex transition-transform duration-300" 
          style={{ transform: `translateX(${position}px)` }}
        >
          {cities.map((city, index) => (
            <CityCard key={index} {...city} />
          ))}
        </div>
        <button 
          className="absolute top-1/2 right-2 -translate-y-1/2 w-10 h-10 bg-white/70 rounded-full flex items-center justify-center z-10 hover:bg-white/90 transition-colors"
          onClick={handleNext}
        >
          &#10095;
        </button>
      </div>
    </section>
  );
}

// Organizer Card Component
function OrganizerCard({ photos, profile, name, location }) {
  const [following, setFollowing] = useState(false);

  return (
    <div className="bg-white min-w-[300px] mr-5 p-5 rounded-lg shadow-md text-center">
      <div className="grid grid-cols-2 gap-1 mb-2">
        {photos.map((photo, index) => (
          <img 
            key={index}
            src={photo} 
            alt={`Photo ${index + 1}`} 
            className="w-full h-20 object-cover rounded"
          />
        ))}
      </div>
      <img 
        src={profile} 
        alt="Profile picture" 
        className="w-16 h-16 rounded-full mx-auto border-4 border-white -mt-8 object-cover"
      />
      <h3 className="mt-2 font-medium">{name}</h3>
      <p className="text-sm text-gray-500">{location}</p>
      <button 
        className={`mt-3 px-8 py-2 rounded-full text-white transition-colors ${following ? 'bg-green-500' : 'bg-blue-500 hover:bg-blue-600'}`}
        onClick={() => setFollowing(!following)}
      >
        {following ? 'Following' : 'Follow'}
      </button>
    </div>
  );
}

// Organizers Slider Component
function OrganizersSlider() {
  const containerRef = useRef(null);
  const organizers = Array(4).fill({
    photos: Array(4).fill("/api/placeholder/150/150"),
    profile: "/api/placeholder/60/60",
    name: "Richard Beresford Harris",
    location: "Helsinki, Finland"
  });
  
  const { position, handlePrev, handleNext } = useSlider(320, organizers.length, containerRef);

  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold my-5">Best event organizers</h2>
      <div className="relative overflow-hidden" ref={containerRef}>
        <button 
          className="absolute top-1/2 left-2 -translate-y-1/2 w-10 h-10 bg-white/70 rounded-full flex items-center justify-center z-10 hover:bg-white/90 transition-colors"
          onClick={handlePrev}
        >
          &#10094;
        </button>
        <div 
          className="flex transition-transform duration-300" 
          style={{ transform: `translateX(${position}px)` }}
        >
          {organizers.map((organizer, index) => (
            <OrganizerCard key={index} {...organizer} />
          ))}
        </div>
        <button 
          className="absolute top-1/2 right-2 -translate-y-1/2 w-10 h-10 bg-white/70 rounded-full flex items-center justify-center z-10 hover:bg-white/90 transition-colors"
          onClick={handleNext}
        >
          &#10095;
        </button>
      </div>
    </section>
  );
}