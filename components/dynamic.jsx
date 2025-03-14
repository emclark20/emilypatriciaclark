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
      title: "User Authentification Plugin",
      description: "Developed a full-stack authentification system with React, Next.js, and CockroachDB. Implemented secure processing and a responsive design.",
      technologies: "React, Next.js, CockroachDB, Jose"
    },
    {
      title: "Interactive Data Visualization",
      description: "Created a dynamic dashboard that visualizes complex datasets using P5.js. The interface allows users to filter and explore data through intuitive controls.",
      technologies: "JavaScript, P5.js, SVG, CSS Grid, REST API"
    },
    {
      title: "Charter Fisherman Design",
      description: "Designed and developed a website for a charter fishing business. The site features a booking system, photo gallery, and contact form.",
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
          
          // Expanded color palette for more visual interest
          const lineColors = [
            p.color(64, 124, 138),    // teal
            p.color(120, 160, 175),   // light teal
            p.color(220, 150, 100),   // orange
            p.color(230, 180, 130),   // light orange
            p.color(100, 100, 100),   // gray
            p.color(180, 90, 120),    // rose
            p.color(140, 170, 100),   // sage green
            p.color(90, 80, 140),     // purple
            p.color(240, 200, 80)     // gold
          ];
          
          // Create flowing lines with more variety
          for (let i = 0; i < 50; i++) { // Increased number of lines
            // Create different types of lines
            const lineType = p.floor(p.random(3)); // 0, 1, or 2
            
            let line = {
              x: p.random(p.width),
              y: p.random(p.height),
              path: [],
              color: p.random(lineColors),
              thickness: p.random(0.5, 3.5), // Wider range of thickness
              speed: p.random(0.5, 3),       // Wider range of speed
              noiseScale: p.random(0.005, 0.02), // Different noise scales for movement
              noiseStrength: p.random(1, 4),     // Different noise influence strength
              type: lineType,                    // Store the line type
              radius: p.random(50, 200),         // For circular motion
              angle: p.random(p.TWO_PI),         // For circular motion
              rotationSpeed: p.random(-0.01, 0.01) // For circular motion
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
          // Using a slightly more opaque white for faster fading
          p.fill(255, 8);
          p.noStroke();
          p.rect(0, 0, p.width, p.height);
          
          // Occasionally add a subtle ripple effect
          if (p.random(100) < 2) { // 2% chance each frame
            const rippleX = p.random(p.width);
            const rippleY = p.random(p.height);
            const rippleSize = p.random(50, 200);
            
            p.noFill();
            p.stroke(255, 15);
            p.strokeWeight(1);
            p.circle(rippleX, rippleY, rippleSize);
            p.circle(rippleX, rippleY, rippleSize * 0.8);
            p.circle(rippleX, rippleY, rippleSize * 0.6);
          }
          
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
            
            // Update path based on line type for more diversity
            let newX, newY;
            
            if (line.type === 0) {
              // Perlin noise flow field with varying scale and strength
              let angle = p.noise(line.x * line.noiseScale, line.y * line.noiseScale, p.frameCount * 0.005) * p.TWO_PI * line.noiseStrength;
              newX = line.x + p.cos(angle) * line.speed;
              newY = line.y + p.sin(angle) * line.speed;
            } 
            else if (line.type === 1) {
              // Circular or spiral motion
              line.angle += line.rotationSpeed;
              let radius = line.radius * (1 - p.noise(p.frameCount * 0.001) * 0.3); // Varying radius for more organic feel
              newX = line.x + p.cos(line.angle) * line.speed;
              newY = line.y + p.sin(line.angle) * line.speed;
            }
            else {
              // Random direction changes with momentum
              let angle = p.noise(
                line.x * line.noiseScale * 0.5, 
                line.y * line.noiseScale * 0.5, 
                p.sin(p.frameCount * 0.01) // Sine wave influence creates more rhythmic patterns
              ) * p.TWO_PI * 2;
              
              // Add some directional bias that varies over time
              angle += p.sin(p.frameCount * 0.01 + line.noiseScale * 100) * 0.5;
              
              newX = line.x + p.cos(angle) * line.speed;
              newY = line.y + p.sin(angle) * line.speed;
            }
            
            // Keep lines within bounds with soft boundary and bounce effect
            if (newX < 0) { 
              newX = Math.abs(newX); // Bounce off the edge
              line.noiseScale = p.random(0.005, 0.02); // Randomize behavior after bounce
            } 
            else if (newX > p.width) { 
              newX = p.width - (newX - p.width); 
              line.noiseScale = p.random(0.005, 0.02);
            }
            
            if (newY < 0) { 
              newY = Math.abs(newY); 
              line.noiseScale = p.random(0.005, 0.02);
            } 
            else if (newY > p.height) { 
              newY = p.height - (newY - p.height); 
              line.noiseScale = p.random(0.005, 0.02);
            }
            
            line.x = newX;
            line.y = newY;
            
            // Add new point to the path
            line.path.unshift({x: line.x, y: line.y});
            
            // Vary the maximum path length for different line types
            const maxLength = line.type === 0 ? 120 : (line.type === 1 ? 80 : 150);
            
            if (line.path.length > maxLength) line.path.pop();
            
            // Occasionally create a new path (line break effect)
            if (p.random(1000) < 3 && line.path.length > 30) { // 0.3% chance
              // Save current position
              const currentX = line.x;
              const currentY = line.y;
              
              // Reset path but keep current position
              line.path = [];
              for (let j = 0; j < 5; j++) {
                line.path.push({x: currentX, y: currentY});
              }
              
              // Randomize some properties to create variation
              line.thickness = p.random(0.5, 3.5);
              line.noiseScale = p.random(0.005, 0.02);
              // 20% chance to also change color
              if (p.random(100) < 20) {
                const lineColors = [
                  p.color(64, 124, 138),    // teal
                  p.color(120, 160, 175),   // light teal
                  p.color(220, 150, 100),   // orange
                  p.color(230, 180, 130),   // light orange
                  p.color(100, 100, 100),   // gray
                  p.color(180, 90, 120),    // rose
                  p.color(140, 170, 100),   // sage green
                  p.color(90, 80, 140),     // purple
                  p.color(240, 200, 80)     // gold
                ];
                line.color = p.random(lineColors);
              }
            }
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