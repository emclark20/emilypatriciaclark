"use client";

import React, { useEffect, useRef, useState } from 'react';

const ArtisticP5Background = () => {
  const containerRef = useRef(null);
  // No longer need to track mode state since we're only using style 1
  const p5InstanceRef = useRef(null);
  const [showPortfolio, setShowPortfolio] = useState(false);

  // Sample project data - replace with your actual projects
  const projects = [
    {
      title: "E-Commerce Platform",
      description: "Developed a full-stack e-commerce solution with React, Node.js, and MongoDB. Implemented secure payment processing and a responsive design.",
      technologies: "React, Node.js, Express, MongoDB, Stripe"
    },
    {
      title: "Interactive Data Visualization",
      description: "Created a dynamic dashboard that visualizes complex datasets using D3.js. The interface allows users to filter and explore data through intuitive controls.",
      technologies: "JavaScript, D3.js, SVG, CSS Grid, REST API"
    },
    {
      title: "Mobile Banking App",
      description: "Designed and developed a mobile banking application with React Native. Features include biometric authentication, transaction history, and bill payments.",
      technologies: "React Native, Redux, Firebase, Jest"
    }
  ];

  useEffect(() => {
    let p5Instance = null;
    
    // Dynamically import p5
    import('p5').then((p5Module) => {
      const p5Constructor = p5Module.default;
      
      // Define the sketch
      const sketch = (p) => {
        // Lines for flowing animation
        let lines = [];
        
        p.setup = () => {
          if (containerRef.current) {
            const canvas = p.createCanvas(
              containerRef.current.offsetWidth,
              containerRef.current.offsetHeight
            );
            canvas.parent(containerRef.current);
            
            // White background for the canvas
            p.background(255);
            
            // Initialize the flowing lines
            initializeLines();
          }
        };
        
        const initializeLines = () => {
          // Clear existing lines
          lines = [];
          
          // Colors for the flowing lines
          const lineColors = [
            p.color(64, 124, 138),  // teal
            p.color(120, 160, 175), // light teal
            p.color(220, 150, 100), // orange
            p.color(230, 180, 130), // light orange
            p.color(100, 100, 100)  // gray
          ];
          
          // Create flowing lines
          for (let i = 0; i < 40; i++) {
            let line = {
              x: p.random(p.width),
              y: p.random(p.height),
              path: [],
              color: p.random(lineColors),
              thickness: p.random(0.5, 2),
              speed: p.random(0.5, 2)
            };
            
            // Initialize path with starting position
            for (let j = 0; j < 10; j++) {
              line.path.push({x: line.x, y: line.y});
            }
            
            lines.push(line);
          }
        };
        
        p.draw = () => {
          // Partially clear with translucent white for fading effect
          p.fill(255, 5);
          p.noStroke();
          p.rect(0, 0, p.width, p.height);
          
          // Draw each line
          for (let line of lines) {
            p.stroke(line.color);
            p.strokeWeight(line.thickness);
            p.noFill();
            
            // Draw line from path points
            p.beginShape();
            for (let point of line.path) {
              p.vertex(point.x, point.y);
            }
            p.endShape();
            
            // Update path - add new point at front, remove last point
            let angle = p.noise(line.x * 0.01, line.y * 0.01, p.frameCount * 0.01) * p.TWO_PI * 2;
            let newX = line.x + p.cos(angle) * line.speed;
            let newY = line.y + p.sin(angle) * line.speed;
            
            // Keep lines within bounds with soft boundary
            if (newX < 0 || newX > p.width) newX = line.x - p.cos(angle) * line.speed;
            if (newY < 0 || newY > p.height) newY = line.y - p.sin(angle) * line.speed;
            
            line.x = newX;
            line.y = newY;
            
            line.path.unshift({x: line.x, y: line.y});
            if (line.path.length > 100) line.path.pop();
          }
        };
        
        // Handle window resize
        p.windowResized = () => {
          if (containerRef.current) {
            p.resizeCanvas(
              containerRef.current.offsetWidth,
              containerRef.current.offsetHeight
            );
            initializeLines(); // Reinitialize lines for the new canvas size
          }
        };
      };
      
      // Create a new p5 instance
      p5Instance = new p5Constructor(sketch);
      
      // Store the instance for cleanup
      p5InstanceRef.current = p5Instance;
    })
    .catch(error => console.error("Failed to load p5.js:", error));

    // Cleanup function to remove the p5 instance when component unmounts
    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
    };
  }, []); // No dependencies since we no longer have mode

  const togglePortfolio = () => {
    setShowPortfolio(!showPortfolio);
  };

  return (
    <div className="relative w-full h-screen">
      <div 
        ref={containerRef} 
        className="absolute inset-0 z-0"
      />
      <div className="relative z-10 flex items-center justify-center h-full">
        {!showPortfolio ? (
          <div className="text-center p-8 bg-white text-black bg-opacity-60 backdrop-blur-md rounded-lg">
            <h1 className="text-4xl font-bold mb-4">Emily Patricia Clark</h1>
            <p className="text-xl mb-6">Web Developer & Designer</p>
            <button 
              onClick={togglePortfolio}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-opacity-80 transition-all"
            >
              View Portfolio
            </button>
          </div>
        ) : (
          <div className="w-full max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              {projects.map((project, index) => (
                <div 
                  key={index}
                  className="
                    w-full md:w-1/3 
                    bg-white/40 text-black border border-white/50
                    backdrop-blur-md rounded-xl 
                    p-6 shadow-lg 
                    transform transition-all duration-300 hover:scale-105
                    flex flex-col
                  "
                  style={{
                    boxShadow: '0 8px 32px rgba(100, 100, 100, 0.1)'
                  }}
                >
                  <h2 className="text-2xl font-bold mb-3">{project.title}</h2>
                  <p className="mb-4 flex-grow">{project.description}</p>
                  <div className="text-sm text-gray-700 mt-auto">
                    <strong>Technologies:</strong> {project.technologies}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <button 
                onClick={togglePortfolio}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-opacity-80 transition-all"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtisticP5Background;