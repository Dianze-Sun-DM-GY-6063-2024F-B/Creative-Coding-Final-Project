
Timid Procedural Creature
1. Inspiration
As a game designer, I have always been captivated by the idea of procedural creatures that can simulate lifelike behaviors while reacting dynamically to their environment. This project explores this concept by creating a timid procedural creature that interacts with the physical world through sound stimuli. The goal was to blend procedural animation with Arduino-based interaction, showcasing how technology can create engaging, responsive digital lifeforms.

2. System Overview
This project consists of two primary components:

Procedural Animation:

Creatures are animated procedurally using P5.js.
Each creature consists of multiple segments that follow the head segment, simulating natural, snake-like motion.
The creatures exhibit two behaviors: idle movement and escape when triggered by sound.
Arduino Integration:

A sound sensor attached to an Arduino board captures ambient noise levels.
The Arduino sends sound data to the P5.js application via serial communication.
If the sound exceeds a threshold, the creatures transition into the escape state, moving rapidly toward the edges of the screen.
3. Development Process
Procedural Creature Animation
The creatures are designed to mimic organic movement. This involves a combination of natural physics-like motion and artistic freedom. Here's how the procedural animation was structured:

Segment-Based Body
Each creature consists of a "head" and several connected "segments."
The head determines the target position and moves smoothly toward it.
The segments follow the head by interpolating their positions toward the preceding segment, creating a natural, trailing motion.
Target Movement
The head's target position is generated using Perlin noise, a technique that creates smooth, continuous variations in movement. This ensures that the creatures' idle state appears fluid and lifelike, as though they are aimlessly wandering.
Escape Behavior
When triggered by sound, the creatures rapidly set new target positions at random screen edges and move toward them.
During the escape state, the segments follow the head more tightly, reducing the trailing effect to simulate urgency.
Arduino Integration
To enable interaction between the physical and virtual worlds, the Arduino processes sound data from the sensor and communicates it to the P5.js application. Here's how this was implemented:

Sound Detection
A sound sensor connected to the Arduino continuously monitors ambient noise.
The analog sound levels are read and compared against a pre-defined threshold.
Data Communication
The Arduino sends sound level data to the P5.js application over serial communication in the format A1:<value>.
This data is parsed by P5.js to determine whether the sound level exceeds the threshold.
Triggering Escape
When the sound level surpasses the threshold:
The Arduino notifies the P5.js program.
The P5.js program triggers the creatures to enter the escape state.
After a set duration, the escape behavior resets, and the creatures return to idle movement.
User Testing
 I focused on calibrating the sound threshold to ensure the creatures responded appropriately to environmental noise. I used varying levels of sound—clapping, speaking, and ambient noise—to observe the system's sensitivity. Initially, the creatures were either too sensitive (triggering escape at low noise) or unresponsive. By iteratively adjusting the threshold value in the Arduino code and testing different sound scenarios, I balanced the response. Louder sounds, such as claps, reliably triggered escape, while normal ambient noise did not affect the creatures. 