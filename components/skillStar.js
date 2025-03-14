"use client";

import React, { useEffect, useRef } from 'react';
import { useState } from 'react';

const SkillConstellation = () => {
  const containerRef = useRef(null);
  const p5InstanceRef = useRef(null);
  const [activeSkill, setActiveSkill] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    let p5Instance = null;
    
    // Skill data structure
    const skillData = [
      // Web Development Core
      { name: "JavaScript", proficiency: 9, category: "Web Development", x: 0.15, y: 0.20, 
        connections: [1, 2, 4], description: "Advanced JS concepts including ES6+, closures, and async patterns" },
      { name: "React", proficiency: 8, category: "Web Development", x: 0.25, y: 0.15, 
        connections: [0, 3], description: "Component architecture, hooks, and state management" },
      { name: "Next.js", proficiency: 7, category: "Web Development", x: 0.20, y: 0.30, 
        connections: [0, 3], description: "Server-side rendering, API routes, and static site generation" },
      { name: "CSS/SCSS", proficiency: 8, category: "Web Development", x: 0.30, y: 0.25, 
        connections: [1, 2], description: "Advanced layouts, animations, and responsive design" },
      { name: "TypeScript", proficiency: 7, category: "Web Development", x: 0.33, y: 0.35, 
        connections: [0, 5], description: "Type definitions, interfaces, and generics" },
      
      // Backend (body part)
      { name: "Node.js", proficiency: 7, category: "Backend", x: 0.40, y: 0.38, 
        connections: [4, 6], description: "Server-side JavaScript, API development, and middleware" },
      { name: "Databases", proficiency: 6, category: "Backend", x: 0.47, y: 0.43, 
        connections: [5, 7], description: "SQL and NoSQL database design and optimization" },
      { name: "DevOps", proficiency: 5, category: "Backend", x: 0.52, y: 0.48, 
        connections: [6, 8], description: "CI/CD pipelines, Docker, and cloud deployment" },
      
      // Left legs
      { name: "UX Design", proficiency: 8, category: "Digital Media", x: 0.40, y: 0.50, 
        connections: [7, 9], description: "User research, wireframing, and interface design" },
      { name: "Visual Design", proficiency: 9, category: "Digital Media", x: 0.32, y: 0.55, 
        connections: [8, 10], description: "Color theory, typography, and visual hierarchy" },
      { name: "Creative Coding", proficiency: 7, category: "Digital Media", x: 0.25, y: 0.60, 
        connections: [9], description: "Generative art, animations, and interactive experiences" },
      
      // Right legs
      { name: "WebGL/3D", proficiency: 6, category: "Digital Media", x: 0.58, y: 0.40, 
        connections: [7, 12], description: "3D modeling, texturing, and interactive 3D for the web" },
      { name: "Video Production", proficiency: 7, category: "Digital Media", x: 0.65, y: 0.45, 
        connections: [11, 13], description: "Filming, editing, and motion graphics" },
      { name: "Photography", proficiency: 8, category: "Digital Media", x: 0.70, y: 0.50, 
        connections: [12], description: "Composition, lighting, and post-processing" },
      
      // Tail
      { name: "UI Animation", proficiency: 7, category: "Digital Media", x: 0.58, y: 0.55, 
        connections: [8, 15], description: "Motion design principles and interactive animations" },
      { name: "AR/VR", proficiency: 6, category: "Digital Media", x: 0.63, y: 0.65, 
        connections: [14, 16], description: "Augmented and virtual reality development" },
      { name: "Data Visualization", proficiency: 8, category: "Web Development", x: 0.70, y: 0.70, 
        connections: [15, 17], description: "Creating interactive data visualizations and dashboards" },
      { name: "API Development", proficiency: 7, category: "Backend", x: 0.78, y: 0.68, 
        connections: [16, 18], description: "RESTful and GraphQL API design and implementation" },
      { name: "Cloud Services", proficiency: 7, category: "Backend", x: 0.85, y: 0.60, 
        connections: [17, 19], description: "AWS, Azure, and Google Cloud platform expertise" },
      { name: "Machine Learning", proficiency: 6, category: "Web Development", x: 0.92, y: 0.50, 
        connections: [18], description: "ML model integration with web applications" }
    ];
    
    // Category colors - white/silver for all categories
    const categoryColors = {
      "Web Development": { h: 0, s: 0, l: 100 }, // White
      "Backend": { h: 0, s: 0, l: 100 },         // White
      "Digital Media": { h: 0, s: 0, l: 100 }    // White
    };
    
    // Dynamically import p5
    import('p5').then((p5Module) => {
      const p5Constructor = p5Module.default;
      
      // Define the sketch
      const sketch = (p) => {
        let stars = [];
        let connections = [];
        let selectedStar = null;
        let scorpionImg = null;
        let imgDisplayed = false;
        
        p.preload = () => {
          // You would replace 'scorpion-wireframe.png' with your actual image path
          scorpionImg = p.loadImage('/images/scorpion-wireframe.png', 
            () => setImageLoaded(true), 
            (err) => console.error('Failed to load image:', err)
          );
        };
        
        p.setup = () => {
          if (containerRef.current) {
            const canvas = p.createCanvas(
              containerRef.current.offsetWidth,
              containerRef.current.offsetHeight
            );
            canvas.parent(containerRef.current);
            
            // Dark space background
            p.background(0, 3, 20);
            
            // Create stars using the skillData positions
            createStars();
            
            // Create connection data
            createConnections();
          }
        };
        
        const createStars = () => {
          stars = [];
          
          // Create stars from skillData with positions translated to canvas coordinates
          skillData.forEach((skill) => {
            const x = skill.x * p.width;
            const y = skill.y * p.height;
            
            // Create star
            stars.push({
              ...skill,
              x,
              y,
              size: p.map(skill.proficiency, 1, 10, 5, 18),
              pulsing: 0,
              originalSize: p.map(skill.proficiency, 1, 10, 5, 18),
              color: getCategoryColor(skill.category),
              glowColor: getCategoryGlowColor(skill.category),
              hovered: false
            });
          });
        };
        
        const getCategoryColor = (category) => {
          const color = categoryColors[category];
          return p.color(color.h, color.s, color.l);
        };
        
        const getCategoryGlowColor = (category) => {
          const color = categoryColors[category];
          return p.color(color.h, color.s, color.l + 20);
        };
        
        const createConnections = () => {
          connections = [];
          
          skillData.forEach((skill, i) => {
            if (skill.connections) {
              skill.connections.forEach(targetIndex => {
                // Only add connection if it doesn't already exist
                if (!connections.some(conn => 
                  (conn.from === i && conn.to === targetIndex) || 
                  (conn.from === targetIndex && conn.to === i))) {
                  
                  connections.push({
                    from: i,
                    to: targetIndex,
                    strength: 0.5 * (skillData[i].proficiency + skillData[targetIndex].proficiency) / 20,
                    active: false
                  });
                }
              });
            }
          });
        };
        
        p.draw = () => {
          // Draw space background
          drawBackground();
          
          // Draw scorpion image with low opacity if loaded
          if (scorpionImg && !imgDisplayed) {
            p.push();
            p.tint(255, 40); // Draw with 15% opacity
            p.image(scorpionImg, 0, 0, p.width, p.height);
            imgDisplayed = true; // Only draw once to avoid flickering
            p.pop();
          }
          
          // Draw connections first (below stars)
          drawConnections();
          
          // Draw stars on top
          drawStars();
          
          // Update hover state for UI interactions
          updateHoverState();
        };
        
        const drawBackground = () => {
          // Create a dark space background
          p.background(0, 3, 20);
          
          // Add dense star field
          for (let i = 0; i < 600; i++) {
            const size = p.random(0, 100);
            let alpha, weight;
            
            // Create varied star sizes
            if (size < 80) {
              // Small stars (most common)
              alpha = p.random(40, 150);
              weight = p.random(0.3, 0.6);
            } else if (size < 95) {
              // Medium stars
              alpha = p.random(100, 200);
              weight = p.random(0.6, 1.2);
            } else {
              // Large bright stars (rare)
              alpha = p.random(180, 230);
              weight = p.random(1.2, 1.8);
            }
            
            p.stroke(255, alpha);
            p.strokeWeight(weight);
            p.point(p.random(p.width), p.random(p.height));
          }
        };
        
        const drawConnections = () => {
          connections.forEach(connection => {
            const fromStar = stars[connection.from];
            const toStar = stars[connection.to];
            
            // Determine if connection should be highlighted
            const isActive = fromStar.hovered || toStar.hovered || 
                            selectedStar === connection.from || 
                            selectedStar === connection.to;
            
            // Set connection appearance
            if (isActive) {
              connection.active = p.lerp(connection.active, 1, 0.1);
            } else {
              connection.active = p.lerp(connection.active, 0.2, 0.05);
            }
            
            // Draw primary connection line
            p.strokeWeight(connection.strength * 1.5 * (0.5 + connection.active));
            
            // Using white for connections
            const mainAlpha = 150 + 105 * connection.active;
            p.stroke(255, mainAlpha);
            p.line(fromStar.x, fromStar.y, toStar.x, toStar.y);
            
            // Add network-like additional connections for wireframe effect
            if (Math.random() > 0.5) { 
              p.strokeWeight(connection.strength * 0.6 * (0.5 + connection.active));
              
              const numLines = p.floor(p.random(2, 6));
              for (let i = 0; i < numLines; i++) {
                // Create offset points around the main line
                const xOffset = p.random(-12, 12);
                const yOffset = p.random(-12, 12);
                
                const midX = (fromStar.x + toStar.x) / 2 + xOffset;
                const midY = (fromStar.y + toStar.y) / 2 + yOffset;
                
                // Draw with lower opacity
                const subAlpha = p.random(30, 90) * connection.active;
                p.stroke(255, subAlpha);
                
                if (Math.random() > 0.5) {
                  p.line(fromStar.x, fromStar.y, midX, midY);
                } else {
                  p.line(midX, midY, toStar.x, toStar.y);
                }
              }
            }
          });
        };
        
        // Draw a glowing star
        const drawStar = (x, y, radius, points) => {
          // Draw outer glow
          p.noStroke();
          const glowColor = p.color(255, 255, 255);
          const glowRadius = radius * 2.5;
          
          // Create gradient glow effect
          for (let i = 5; i > 0; i--) {
            glowColor.setAlpha(10 * i);
            p.fill(glowColor);
            p.ellipse(x, y, glowRadius * (1 - i*0.15));
          }
          
          // Draw the star shape
          p.fill(255);
          const angleStep = p.TWO_PI / points / 2;
          p.beginShape();
          for (let i = 0; i < points * 2; i++) {
            const angle = i * angleStep;
            // Make the inner radius larger for chunkier stars like in the reference
            const r = i % 2 === 0 ? radius : radius * 0.3;
            const sx = x + p.cos(angle) * r;
            const sy = y + p.sin(angle) * r;
            p.vertex(sx, sy);
          }
          p.endShape(p.CLOSE);
          
          // Draw center highlight
          p.fill(255);
          p.ellipse(x, y, radius * 0.5);
        };
        
        const drawStars = () => {
          stars.forEach((star, index) => {
            const isSelected = selectedStar === index;
            const isHovered = star.hovered;
            
            // Update pulsing effect
            if (isSelected || isHovered) {
              star.pulsing = p.lerp(star.pulsing, 1, 0.1);
            } else {
              star.pulsing = p.lerp(star.pulsing, 0, 0.05);
            }
            
            // Dynamic size based on interaction
            const pulseAmount = 1 + 0.3 * p.sin(p.frameCount * 0.1) * star.pulsing;
            star.size = star.originalSize * (1 + 0.4 * star.pulsing) * pulseAmount;
            
            // Draw star (glowing effect is included in the drawStar function)
            drawStar(star.x, star.y, star.size, 5); // 5-pointed star
            
            // Draw name if hovered or selected
            if (isHovered || isSelected) {
              p.fill(255);
              p.textAlign(p.CENTER, p.BOTTOM);
              p.textSize(14);
              p.textStyle(p.BOLD);
              p.text(star.name, star.x, star.y - star.size - 10);
              
              // Draw proficiency level
              p.textSize(12);
              p.textStyle(p.NORMAL);
              p.text(`Level: ${star.proficiency}/10`, star.x, star.y - star.size - 30);
            }
          });
        };
        
        const updateHoverState = () => {
          // Reset all hover states
          let hoveredIndex = null;
          
          // Check each star
          for (let i = 0; i < stars.length; i++) {
            const star = stars[i];
            const d = p.dist(p.mouseX, p.mouseY, star.x, star.y);
            
            if (d < star.size * 1.5) {
              hoveredIndex = i;
              star.hovered = true;
            } else {
              star.hovered = false;
            }
          }
          
          // Update cursor
          if (hoveredIndex !== null) {
            p.cursor(p.HAND);
            
            // Update active skill in React state if different
            if (activeSkill !== skillData[hoveredIndex]) {
              setActiveSkill(skillData[hoveredIndex]);
            }
          } else {
            p.cursor(p.ARROW);
            
            // Clear active skill if no hover
            if (activeSkill !== null && !stars.some(star => star.hovered)) {
              setActiveSkill(null);
            }
          }
        };
        
        // Mouse click to select/deselect star
        p.mouseClicked = () => {
          if (!containerRef.current || !containerRef.current.contains(p.canvas)) {
            return;
          }
          
          // Find if a star was clicked
          for (let i = 0; i < stars.length; i++) {
            const star = stars[i];
            const d = p.dist(p.mouseX, p.mouseY, star.x, star.y);
            
            if (d < star.size * 1.5) {
              // Toggle selection
              selectedStar = selectedStar === i ? null : i;
              return;
            }
          }
          
          // If no star was clicked, clear selection
          selectedStar = null;
        };
        
        // Handle window resize
        p.windowResized = () => {
          if (containerRef.current) {
            p.resizeCanvas(
              containerRef.current.offsetWidth,
              containerRef.current.offsetHeight
            );
            // Recalculate star positions
            imgDisplayed = false;
            stars.forEach((star, index) => {
              star.x = skillData[index].x * p.width;
              star.y = skillData[index].y * p.height;
            });
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
  }, [activeSkill]);

  return (
    <div className="relative w-full h-screen">
      <div 
        ref={containerRef} 
        className="absolute inset-0 z-0"
      />
      
      {/* Information panel */}
      <div className="absolute bottom-4 right-4 z-10 w-80 p-4 bg-black bg-opacity-80 rounded-lg text-white">
        <h2 className="text-xl font-bold mb-2">
          {activeSkill ? activeSkill.name : "Skill Constellation"}
        </h2>
        <p className="text-sm opacity-80 mb-4">
          {activeSkill 
            ? activeSkill.description 
            : "Hover over stars to explore my skills in the scorpion constellation. Stars are sized by proficiency."}
        </p>
        
        {activeSkill && (
          <div className="flex items-center mt-2">
            <div className="text-sm mr-2">Proficiency:</div>
            <div className="h-2 flex-grow bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-blue-300 to-white"
                style={{
                  width: `${activeSkill.proficiency * 10}%`
                }}
              ></div>
            </div>
            <div className="text-sm ml-2">{activeSkill.proficiency}/10</div>
          </div>
        )}
        
        <div className="flex justify-between mt-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-white mr-1 border border-gray-300"></div>
            <span>Web Development</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-white mr-1 border border-gray-300"></div>
            <span>Backend</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-white mr-1 border border-gray-300"></div>
            <span>Digital Media</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillConstellation;