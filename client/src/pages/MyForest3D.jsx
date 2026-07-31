import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Spline from "@splinetool/react-spline";
import { DotLottiePlayer } from "@dotlottie/react-player";
import "@dotlottie/react-player/dist/index.css";
import { useAuth } from "../context/AuthContext.jsx";
import { apiFetch } from "../api/client.js";

// Create these variable names in your Spline file for direct control.
const SPLINE_VAR = {
  stage: "bk_stage",
  treeCount: "bk_tree_count",
  animalCount: "bk_animal_count",
  flowerCount: "bk_flower_count",
  riverOn: "bk_river_on",
  cloudsOn: "bk_clouds_on",
  cleanGroundOn: "bk_clean_ground_on",
  particlesOn: "bk_particles_on",
  finaleOn: "bk_finale_on",
  foliageBoost: "bk_foliage_boost",
  treeScaleBoost: "bk_tree_scale_boost",
  sunBoost: "bk_sun_boost",
};

// Optional object/group names inside Spline scene.
const SPLINE_GROUPS = {
  ground: ["Ground", "ground", "Land", "land", "Terrain", "terrain"],
  particles: ["AirParticles", "airParticles", "FX_AirParticles"],
  river: ["River", "river", "Water_River"],
  clouds: ["Clouds", "clouds", "Sky_Clouds"],
  cleanGround: ["CleanGround", "cleanGround", "Ground_Clean"],
  animals: ["Animals", "animals", "Wildlife"],
  finale: ["Finale", "finale", "FinaleWorld", "FinaleMode"],
  flowers: ["Flowers", "flowers", "FlowerField"],
  treesAll: ["Trees", "trees", "ForestTrees", "forestTrees"],
  trees1: ["Trees_Tier1", "trees_tier1"],
  trees2: ["Trees_Tier2", "trees_tier2"],
  trees3: ["Trees_Tier3", "trees_tier3"],
  trees4: ["Trees_Tier4", "trees_tier4"],
  blockedCharacters: ["Giraffe", "giraffe", "Giraffe_01", "Animal_Giraffe", "Deer", "deer"],
  pigCharacter: ["Pig", "pig", "Pig_01", "Character_Pig", "Animal_Pig", "Buddy"],
  pigPlant: [
    "Plant",
    "plant",
    "Leaf",
    "leaf",
    "LeafInHand",
    "PlantInHand",
    "Sprout",
    "sprout",
    "Stem",
    "stem",
    "Twig",
    "twig",
    "Sapling",
    "sapling",
    "Seedling",
    "seedling",
    "HeldPlant",
    "heldPlant",
    "HandPlant",
    "handPlant",
    "Prop_Plant",
    "prop_plant",
  ],
};

function setVisibleIfExists(app, names, visible) {
  if (!app || typeof app.findObjectByName !== "function") return;
  names.forEach((name) => {
    try {
      const obj = app.findObjectByName(name);
      if (obj) obj.visible = Boolean(visible);
    } catch {
      // Ignore missing objects / API quirks safely.
    }
  });
}

function setVariableIfExists(app, key, value) {
  if (!app || typeof app.setVariable !== "function") return;
  try {
    app.setVariable(key, value);
  } catch {
    // Ignore if the variable doesn't exist in scene.
  }
}

function walkSceneObjects(root, visit) {
  if (!root || typeof visit !== "function") return;
  const stack = [root];
  while (stack.length > 0) {
    const node = stack.pop();
    if (!node) continue;
    visit(node);
    const kids = Array.isArray(node.children) ? node.children : [];
    for (let i = 0; i < kids.length; i += 1) stack.push(kids[i]);
  }
}

function getSplineSceneRoot(app) {
  // Spline runtime internals differ by version; try common roots.
  return app?._scene || app?.scene || app?._data?.scene || null;
}

function forceEarlyStageGroundOnly(app, stage) {
  if (!app || stage >= 3) return;
  const root = getSplineSceneRoot(app);
  if (!root) return;

  const keepRegex = /(ground|land|terrain|floor|base|path)/i;
  const keepCharacterRegex = /(pig|buddy|character_pig|animal_pig)/i;
  const keepPlantRegex = /(leaf|plant|sprout|leafinhand|plantinhand|stem|twig|sapling|seedling|held|prop)/i;
  const hideRegex = /(tree|bush|plant|grass|flower|rock|stone|water|river|pond|lake|cloud|animal|bird|bench|mushroom|fx|particle)/i;

  walkSceneObjects(root, (obj) => {
    const name = String(obj?.name || "");
    if (!name) return;
    if (keepRegex.test(name)) {
      obj.visible = true;
      return;
    }
    // After task 1 approval, show character body.
    if (stage >= 1 && keepCharacterRegex.test(name)) {
      obj.visible = true;
      return;
    }
    // After task 2 approval, show plant in hand.
    if (stage >= 2 && keepPlantRegex.test(name)) {
      obj.visible = true;
      return;
    }
    if (hideRegex.test(name)) {
      obj.visible = false;
    }
  });
}

function enforceStoryStageGates(app, stage) {
  if (!app) return;
  const root = getSplineSceneRoot(app);
  if (!root) return;

  const particlesRegex = /(air.?particle|particle|fx.?air|dust|mote)/i;
  const riverRegex = /(river|water|pond|lake|stream|waterfall|brook)/i;
  const cloudRegex = /(cloud|sky.?cloud|mist|fog)/i;
  const cleanGroundRegex = /(clean.?ground|cleanland|tidy.?ground|trash.?free)/i;
  const animalRegex = /(animal|wildlife|deer|giraffe|pig|buddy|bird)/i;
  const flowerRegex = /(flower|blossom|petal|bloom)/i;
  const finaleRegex = /(finale|celebration|firework|confetti|victory)/i;

  walkSceneObjects(root, (obj) => {
    const name = String(obj?.name || "");
    if (!name) return;

    if (particlesRegex.test(name)) obj.visible = stage >= 2;
    if (riverRegex.test(name)) obj.visible = stage >= 5;
    if (cloudRegex.test(name)) obj.visible = stage >= 6;
    if (cleanGroundRegex.test(name)) obj.visible = stage >= 7;
    if (animalRegex.test(name)) obj.visible = stage >= 8;
    if (flowerRegex.test(name)) obj.visible = stage >= 9;
    if (finaleRegex.test(name)) obj.visible = stage >= 10;
  });
}

function logSplineCandidateNames(app) {
  if (!app || !import.meta.env.DEV) return;
  const root = getSplineSceneRoot(app);
  if (!root) return;
  const pattern = /(pig|buddy|leaf|plant|sprout|stem|twig|held|prop)/i;
  const names = new Set();
  walkSceneObjects(root, (obj) => {
    const n = String(obj?.name || "").trim();
    if (n && pattern.test(n)) names.add(n);
  });
  if (names.size > 0) {
    // Helps map exact Spline object names if a prop still stays visible.
    console.log("[Spline Forest] Candidate object names:", Array.from(names).sort());
  }
}

function applyForestStateToSpline(app, forest) {
  if (!app || !forest) return;
  const completed = new Set(forest.completedSceneIds || []);
  const has = (n) => completed.has(`scene-${n}`);
  const stage = has(10)
    ? 10
    : has(9)
      ? 9
      : has(8)
        ? 8
        : has(7)
          ? 7
          : has(6)
            ? 6
            : has(5)
              ? 5
              : has(4)
                ? 4
                : has(3)
                  ? 3
                  : has(2)
                    ? 2
                    : has(1)
                      ? 1
                      : 0;

  // Scene/task progression mapping (exactly as your 10-scene story).
  const storyParticlesOn = stage >= 2; // Shared Breath
  const storyTreesOn = stage >= 3; // Breathing Trees
  const storyFoliageBoost = stage >= 4 ? forest.foliageBoost ?? 1.5 : 1; // Leaves That Give Life
  const storyRiverOn = stage >= 5; // River That Remembers
  const storyCloudsOn = stage >= 6; // Journey of Water
  const storyCleanGroundOn = stage >= 7; // Earth That Holds You
  const storyAnimalsOn = stage >= 8; // Ones Who Walk Beside You
  const storyFlowersOn = stage >= 9; // Life You Grow
  const storyFinaleOn = stage >= 10; // One Life, One World

  // Primary control path: Spline variables.
  setVariableIfExists(app, SPLINE_VAR.stage, stage);
  setVariableIfExists(app, SPLINE_VAR.treeCount, storyTreesOn ? forest.treeCount ?? 0 : 0);
  setVariableIfExists(app, SPLINE_VAR.animalCount, storyAnimalsOn ? forest.animalCount ?? 0 : 0);
  setVariableIfExists(app, SPLINE_VAR.flowerCount, storyFlowersOn ? forest.flowerCount ?? 0 : 0);
  setVariableIfExists(app, SPLINE_VAR.riverOn, storyRiverOn);
  setVariableIfExists(app, SPLINE_VAR.cloudsOn, storyCloudsOn);
  setVariableIfExists(app, SPLINE_VAR.cleanGroundOn, storyCleanGroundOn);
  setVariableIfExists(app, SPLINE_VAR.particlesOn, storyParticlesOn);
  setVariableIfExists(app, SPLINE_VAR.finaleOn, storyFinaleOn);
  setVariableIfExists(app, SPLINE_VAR.foliageBoost, storyFoliageBoost);
  setVariableIfExists(app, SPLINE_VAR.treeScaleBoost, forest.treeScaleBoost ?? 1);
  setVariableIfExists(app, SPLINE_VAR.sunBoost, storyFinaleOn ? forest.sunBoost ?? 1.35 : 1);

  // Fallback control path: object visibility by name.
  setVisibleIfExists(app, SPLINE_GROUPS.ground, true);
  setVisibleIfExists(app, SPLINE_GROUPS.particles, storyParticlesOn);
  setVisibleIfExists(app, SPLINE_GROUPS.river, storyRiverOn);
  setVisibleIfExists(app, SPLINE_GROUPS.clouds, storyCloudsOn);
  setVisibleIfExists(app, SPLINE_GROUPS.cleanGround, storyCleanGroundOn);
  setVisibleIfExists(app, SPLINE_GROUPS.animals, storyAnimalsOn && (forest.animalCount ?? 0) > 0);
  setVisibleIfExists(app, SPLINE_GROUPS.finale, storyFinaleOn);
  setVisibleIfExists(app, SPLINE_GROUPS.flowers, storyFlowersOn && (forest.flowerCount ?? 0) > 0);
  setVisibleIfExists(app, SPLINE_GROUPS.treesAll, storyTreesOn);
  setVisibleIfExists(app, SPLINE_GROUPS.trees1, storyTreesOn && (forest.treeCount ?? 0) >= 1);
  setVisibleIfExists(app, SPLINE_GROUPS.trees2, storyTreesOn && (forest.treeCount ?? 0) >= 4);
  setVisibleIfExists(app, SPLINE_GROUPS.trees3, storyTreesOn && (forest.treeCount ?? 0) >= 7);
  setVisibleIfExists(app, SPLINE_GROUPS.trees4, storyTreesOn && (forest.treeCount ?? 0) >= 10);
  // Extra safety for very early scenes only.
  if (stage < 3) forceEarlyStageGroundOnly(app, stage);
  // Additional safety across all stages when Spline variable hooks are absent.
  enforceStoryStageGates(app, stage);

  // Keep explicit character/prop visibility rules last so fallback logic can't override them.
  setVisibleIfExists(app, SPLINE_GROUPS.blockedCharacters, stage >= 8);
  // Your request:
  // - After task 1 approved: show the character.
  // - After task 2 approved: show plant in hand.
  setVisibleIfExists(app, SPLINE_GROUPS.pigCharacter, stage >= 1);
  setVisibleIfExists(app, SPLINE_GROUPS.pigPlant, stage >= 2);
}

export default function MyForest3D() {
  const { token, loading } = useAuth();
  const [forest, setForest] = useState(null);
  const [err, setErr] = useState("");
  const splineRef = useRef(null);
  const showPerchedBird = useMemo(() => {
    const completed = new Set(forest?.completedSceneIds || []);
    return completed.has("scene-8");
  }, [forest]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await apiFetch("/api/user/forest", { token });
        if (!cancelled) {
          setForest(data.forest || null);
          setErr("");
        }
      } catch (e) {
        if (!cancelled) setErr(e.data?.error || e.message || "Could not load forest");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (!splineRef.current || !forest) return;
    applyForestStateToSpline(splineRef.current, forest);
  }, [forest]);

  const handleSplineLoad = useCallback((app) => {
    splineRef.current = app;
    logSplineCandidateNames(app);
    if (forest) applyForestStateToSpline(app, forest);
  }, [forest]);

  const canShowScene = useMemo(() => !loading, [loading]);

  if (!canShowScene) {
    return <main className="h-[100dvh] min-h-[100dvh] w-full overflow-hidden bg-black" />;
  }

  return (
    <main className="relative h-[100dvh] min-h-[100dvh] w-full overflow-hidden bg-black">
      <Spline scene="https://prod.spline.design/wVkDLdu81OjBUmL1/scene.splinecode" onLoad={handleSplineLoad} />
      {showPerchedBird && (
        <>
          {["a", "b", "c", "d"].map((slot) => (
            <div key={slot} className={`forest3d-tree-bird forest3d-tree-bird--${slot}`} aria-hidden>
              <DotLottiePlayer
                src="/animations/bird.lottie"
                autoplay
                loop
                background="transparent"
                className="forest3d-tree-bird-player"
              />
            </div>
          ))}
        </>
      )}
      {err && (
        <p className="pointer-events-none absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-lg bg-rose-900/80 px-3 py-2 text-sm font-semibold text-rose-50">
          {err}
        </p>
      )}
    </main>
  );
}
