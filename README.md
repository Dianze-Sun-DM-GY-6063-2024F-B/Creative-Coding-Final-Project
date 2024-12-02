MileStone2
Timid Procedural Creature: Overview and Development Plan
Planned Interactions
Normal Wandering:
Creatures will move randomly with smooth transitions. Their movement may vary based on unique characteristics like size or shape, creating subtle individuality among them.

Panic Reaction:
When a loud sound is detected, all creatures will scatter quickly to the edges of the canvas, mimicking a "hiding" behavior.

Calm Recovery:
After hiding for a brief period (around 6 seconds), creatures will cautiously return to their normal wandering behavior.

System Overview
Arduino Integration:
The Arduino will use a sound sensor (likely a microphone module) to detect loud noises. When the sound exceeds a threshold, it will send a simple binary signal:

1 to indicate a "panic" state.
0 to indicate a "calm" state.
This minimal data transfer ensures a straightforward connection between hardware and software.
Browser-Based Interface:
The visual representation of the creatures and their behavior will be created using p5.js, providing smooth and dynamic motion effects on the canvas.

Development Plan
Creature Wandering:

Implement random motion for creatures, ensuring they stay within the canvas boundaries.
Add variations in movement to reflect differences in creature size or shape, making their wandering behavior feel more natural and lifelike.
Sound Integration:

Set up the Arduino sound sensor to detect loud noises and send a signal (1) when triggered.
Use serial communication to transfer this signal to the p5.js sketch to control creature behavior.
Panic Behavior:

Add logic for creatures to quickly move toward the edges of the canvas when panic mode is activated.
Ensure this behavior is visually distinct from normal wandering, emphasizing their reaction to the sound.
Timing and Recovery:

Use a timer to keep creatures in panic mode for 6 seconds.
Afterward, seamlessly transition them back to wandering mode.
Progress and Next Steps
Progress This Week:
I have started by implementing a basic effect where multiple blocks follow a single leading block. This initial experiment is simple but lays the groundwork for more advanced behaviors.

Next Steps:

Enhancing the Follow Mechanism:

Improve the current follow logic to make the movement smoother and more natural.
Incorporate rotation for each block to align with its direction of motion, adding visual realism to the system.
Class-Based Optimization:

Refactor the code to use classes, making it easier to manage individual creatures.
Enable dynamic control over the number of creatures, allowing for scalability.
Random Movement:

Introduce random target points for the creatures to move toward, instead of following a single leader.
This will add complexity and realism to their wandering behavior.
Visual and Behavioral Diversity:

Experiment with varying colors, sizes, and shapes for each creature to create a more visually engaging system.
Develop distinct behavioral patterns, such as grouping or clustering, to make their responses richer.
Interactivity:

Explore additional ways for the creatures to respond to external stimuli, such as mouse interactions or sound input.
Integrate the Arduino sound sensor to trigger the panic mode, connecting the digital behavior with real-world events.
Long-Term Goals
Once the basic wandering, panic, and recovery behaviors are complete, I aim to:

Add animation effects to make the creatures more visually dynamic during movement or panic.
Introduce more complex group behaviors, such as clustering when hiding or spreading out during wandering.
Test the system extensively to refine its interactivity and ensure a smooth user experience.
This plan provides a clear roadmap for developing a responsive and engaging system that combines randomness, interaction, and dynamic visuals.
MileStone1
Timid Procedural Creatures

The screen showcases a group of lively procedural creatures, moving randomly as if they possess their own life. Each creature is composed of a segmented body, with each segment smoothly following the head's position and rotation, creating a fluid and dynamic motion.
Through the integration of Arduino and sound sensors, these creatures exhibit a "sensitive response" to external stimuli. When a sudden loud sound occurs in the environment, the creatures react immediately, fleeing to the edges of the screen as if searching for safety. This escape behavior lasts for a few seconds before they gradually calm down and return to their normal random movements.

Procedural Spider

Inspired by a procedural spider walking project I previously created in Unity, I aim to revisit this concept in P5.js. My goal is to simulate the spider's gait and behavior, making it appear natural and lifelike.
The spider's movement is procedurally generated: each leg automatically finds and steps in the position of the previous leg, forming a continuous and smooth walking effect. This algorithm gives the spider's gait a sense of order and even a mechanical aesthetic.
Users can control the spider's direction using a joystick, and press a button to make it weave webs.

Snake Game

This snake game builds upon the classic gameplay while incorporating modern visual effects and innovative mechanics. The snake's body is made up of dynamic geometric shapes, with smooth motion and a touch of inertia. The food may move randomly or hide temporarily, adding challenges to the game. It also introduces reward mechanisms such as speed boosts or visual effects.
Additionally, the game can integrate external devices like Arduino, allowing players to control the snake's movement with a joystick or use sound inputs to trigger jumps or quick turns, breathing new life into the classic snake game with enhanced interactivity.