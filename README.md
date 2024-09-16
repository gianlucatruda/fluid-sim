# Fluid-Sim Sailor (work in progress)

A 2D fluid simulation sailing game where you have to hit just the right angles with your boat and sails in order to navigate the claustrophobic riverways without crashing into the banks or being caught by other boats.

[<img alt="Made with love at the Recurse Center" src="https://cloud.githubusercontent.com/assets/2883345/11325206/336ea5f4-9150-11e5-9e90-d86ad31993d8.png" height="20">](https://www.recurse.com/)

Try it out at [fluid-sim-sailor.vercel.app](https://fluid-sim-sailor.vercel.app)

---

The prompt for Wednesday's creative coding session was an excerpt from Italo Calvino's _Invisible Cities_ that contained the following section:

> ...the white and red wind-socks flapping, the chimneys belching smoke, he thinks of a ship; he knows it is a city, but he thinks of it as a vessel that will take him away from the desert, a windjammer about to cast off, with the breeze already swelling the sails, not yet unfurled...

I based it on [this example](https://neuroid.co.uk/lab/fluid/) and the broad strokes of their implementation. I believe that makes it some variant of the Lattice-Boltzmann approach, but I ended up just hacking away at it in various ways that probably make it less of a good simulation, but more fun to build and play with.

It's still not interactive, but it's fun to watch. The canvas is sized based on the browser window, so it's interesting how different window sizes or mobile layout affect the stability of the fluid system.
