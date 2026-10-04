
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let W = 0;
let H = 0;

let time = 0;
let paused = false;
let glowEnabled = true;


/* =========================================
   MAIN DRESS COLOR
   ========================================= */

const DRESS_COLOR = "#246BFF";


/* =========================================
   RESIZE
   ========================================= */

function resize() {

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    W = window.innerWidth;
    H = window.innerHeight;

    canvas.width = W * dpr;
    canvas.height = H * dpr;

    canvas.style.width = W + "px";
    canvas.style.height = H + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", resize);

resize();


/* =========================================
   UTILS
   ========================================= */

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
}


/* =========================================
   FOREST PARTICLES
   ========================================= */

const particles = [];

for (let i = 0; i < 160; i++) {

    particles.push({
        x: Math.random(),
        y: Math.random(),
        size: rand(.4, 2),
        speed: rand(.03, .16),
        alpha: rand(.15, .8),
        phase: rand(0, Math.PI * 2)
    });
}


/* =========================================
   SPARKLES
   ========================================= */

const sparkles = [];

for (let i = 0; i < 100; i++) {

    sparkles.push({
        x: rand(-.8, .8),
        y: rand(.1, .95),
        size: rand(.7, 2.4),
        phase: rand(0, Math.PI * 2),
        speed: rand(.5, 2)
    });
}


/* =========================================
   BACKGROUND
   ========================================= */

function drawBackground() {

    const gradient = ctx.createRadialGradient(
        W * .5,
        H * .38,
        0,
        W * .5,
        H * .5,
        Math.max(W, H)
    );

    gradient.addColorStop(0, "#17234a");
    gradient.addColorStop(.35, "#0a1028");
    gradient.addColorStop(.72, "#040716");
    gradient.addColorStop(1, "#010207");

    ctx.fillStyle = gradient;

    ctx.fillRect(0, 0, W, H);


    /* Moon glow */

    const moonX = W * .78;
    const moonY = H * .20;

    const moonGlow = ctx.createRadialGradient(
        moonX,
        moonY,
        0,
        moonX,
        moonY,
        H * .25
    );

    moonGlow.addColorStop(0, "rgba(180,210,255,.25)");
    moonGlow.addColorStop(.35, "rgba(110,150,255,.08)");
    moonGlow.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = moonGlow;
    ctx.fillRect(0, 0, W, H);


    /* Moon */

    ctx.beginPath();

    ctx.arc(
        moonX,
        moonY,
        Math.min(W,H) * .055,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "rgba(220,235,255,.75)";
    ctx.fill();


    /* Stars */

    for (const p of particles) {

        const x = p.x * W;

        const y =
            ((p.y + time * p.speed * .008) % 1) * H;

        const alpha =
            p.alpha *
            (.55 + Math.sin(time * .03 + p.phase) * .45);

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            p.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            rgba(210,225,255,${alpha});

        ctx.fill();
    }
}


/* =========================================
   FOREST
   ========================================= */

function drawTree(x, baseY, size, alpha) {

    ctx.save();

    ctx.globalAlpha = alpha;

    /* trunk */

    ctx.fillStyle = "#05070d";

    ctx.fillRect(
        x - size * .035,
        baseY - size * .55,
        size * .07,
        size * .55
    );


    /* leaves */

    for (let i = 0; i < 5; i++) {

        const yy =
            baseY - size * (.25 + i * .12);

        const width =
            size * (.18 + i * .035);

        ctx.beginPath();

ctx.moveTo(x, yy - size * .16);

        ctx.lineTo(
            x - width,
            yy + size * .14
        );

        ctx.lineTo(
            x + width,
            yy + size * .14
        );

        ctx.closePath();

        ctx.fillStyle = "#03050b";

        ctx.fill();
    }

    ctx.restore();
}


function drawForest() {

    const ground = H * .88;

    for (let i = 0; i < 18; i++) {

        const x =
            (i / 18) * W +
            Math.sin(i * 2.4) * W * .025;

        const size =
            H * (.28 + (i % 4) * .045);

        drawTree(
            x,
            ground,
            size,
            .45
        );
    }


    /* foreground */

    ctx.fillStyle = "#010207";

    ctx.beginPath();

    ctx.moveTo(0, H);

    ctx.lineTo(0, H * .88);

    for (let x = 0; x <= W; x += 40) {

        const y =
            H * .89 +
            Math.sin(x * .018) * 10;

        ctx.lineTo(x, y);
    }

    ctx.lineTo(W, H);

    ctx.closePath();

    ctx.fill();
}


/* =========================================
   CHARACTER
   ========================================= */

function drawCharacter() {

    const cx = W * .5;

    const scale =
        Math.min(W, H) / 700;

    const bodyTop =
        H * .29;

    const sway =
        Math.sin(time * .018) * 9;

    const breathing =
        Math.sin(time * .025) * 2;


    ctx.save();

    ctx.translate(cx + sway, bodyTop);


    /* =====================================
       SHADOW
       ===================================== */

    ctx.save();

    ctx.scale(1, .25);

    ctx.beginPath();

    ctx.ellipse(
        0,
        H * .57,
        W * .17,
        H * .06,
        0,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "rgba(0,0,0,.65)";

    ctx.fill();

    ctx.restore();


    /* =====================================
       HAIR BACK
       ===================================== */

    const hairWave =
        Math.sin(time * .022) * 7;

    ctx.beginPath();

    ctx.moveTo(-42, 8);

    ctx.bezierCurveTo(
        -100,
        40 + hairWave,
        -86,
        180,
        -55,
        280
    );

    ctx.bezierCurveTo(
        -35,
        325,
        15,
        325,
        52,
        270
    );

    ctx.bezierCurveTo(
        92,
        180,
        94,
        50,
        40,
        8
    );

    ctx.closePath();

    const hairGradient =
        ctx.createLinearGradient(
            -60,
            0,
            60,
            300
        );

    hairGradient.addColorStop(0, "#11131d");
    hairGradient.addColorStop(.5, "#05060c");
    hairGradient.addColorStop(1, "#010207");

    ctx.fillStyle = hairGradient;

    ctx.fill();


    /* =====================================
       DRESS GLOW
       ===================================== */

    if (glowEnabled) {

        const glow =
            ctx.createRadialGradient(
                0,
                240,
                10,
                0,
                240,
                260
            );

        glow.addColorStop(
            0,
            "rgba(45,110,255,.24)"
        );

        glow.addColorStop(
            .45,
            "rgba(30,80,255,.09)"
        );

        glow.addColorStop(
            1,
            "rgba(0,0,0,0)"
        );

        ctx.fillStyle = glow;

        ctx.beginPath();

        ctx.arc(
            0,
            240,
            260,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }


    /* =====================================
       DRESS
       ===================================== */

    const dressGradient =
        ctx.createLinearGradient(
            -150,
            50,
            150,
            480
        );

    dressGradient.addColorStop(
        0,
        "#8ab2ff"
    );

    dressGradient.addColorStop(
        .22,
        DRESS_COLOR
    );

    dressGradient.addColorStop(
        .55,
        "#123caa"
    );

    dressGradient.addColorStop(
        1,
        "#050c28"
    );


    ctx.beginPath();

    /* shoulder */

    ctx.moveTo(-34, 55);

/* left side */

    ctx.bezierCurveTo(
        -70,
        115,
        -70,
        160,
        -105,
        230
    );

    ctx.bezierCurveTo(
        -130,
        290,
        -160,
        350,
        -195,
        430
    );

    /* bottom */

    ctx.bezierCurveTo(
        -115,
        465,
        -55,
        475,
        0,
        470
    );

    ctx.bezierCurveTo(
        75,
        480,
        145,
        465,
        195,
        430
    );

    /* right side */

    ctx.bezierCurveTo(
        160,
        350,
        130,
        290,
        105,
        230
    );

    ctx.bezierCurveTo(
        70,
        160,
        70,
        115,
        34,
        55
    );

    ctx.closePath();

    ctx.fillStyle =
        dressGradient;

    ctx.fill();


    /* =====================================
       DRESS FOLDS
       ===================================== */

    ctx.save();

    ctx.globalAlpha = .24;

    for (let i = -5; i <= 5; i++) {

        const x = i * 28;

        ctx.beginPath();

        ctx.moveTo(
            x,
            110
        );

        ctx.bezierCurveTo(
            x - 20,
            220,
            x + 15,
            340,
            x * 1.35,
            450
        );

        ctx.lineWidth =
            3 + Math.abs(i) * .4;

        ctx.strokeStyle =
            i % 2 === 0
                ? "#b8d2ff"
                : "#06194e";

        ctx.stroke();
    }

    ctx.restore();


    /* =====================================
       WAIST
       ===================================== */

    ctx.beginPath();

    ctx.ellipse(
        0,
        125,
        43,
        20,
        0,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        DRESS_COLOR;

    ctx.fill();


    /* =====================================
       NECK
       ===================================== */

    ctx.fillStyle = "#e8c5ad";

    ctx.fillRect(
        -13,
        28,
        26,
        32
    );


    /* =====================================
       FACE
       ===================================== */

    ctx.beginPath();

    ctx.ellipse(
        0,
        0,
        38,
        48,
        0,
        0,
        Math.PI * 2
    );

    const skin =
        ctx.createLinearGradient(
            -40,
            -40,
            40,
            45
        );

    skin.addColorStop(0, "#ffe0ca");
    skin.addColorStop(1, "#c98e76");

    ctx.fillStyle = skin;

    ctx.fill();


    /* =====================================
       FACE SHADOW
       ===================================== */

    ctx.beginPath();

    ctx.ellipse(
        12,
        6,
        25,
        42,
        0,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "rgba(100,45,40,.12)";

    ctx.fill();


    /* =====================================
       HAIR FRONT
       ===================================== */

    ctx.beginPath();

    ctx.moveTo(-40, -5);

    ctx.bezierCurveTo(
        -50,
        -50,
        -25,
        -75,
        8,
        -70
    );

    ctx.bezierCurveTo(
        50,
        -68,
        57,
        -30,
        40,
        5
    );

    ctx.bezierCurveTo(
        25,
        -18,
        10,
        -28,
        -4,
        -30
    );

    ctx.bezierCurveTo(
        -18,
        -25,
        -30,
        -15,
        -40,
        -5
    );

    ctx.closePath();

    ctx.fillStyle =
        "#090b13";

    ctx.fill();


    /* =====================================
       EYES
       ===================================== */

    ctx.fillStyle =
        "#171522";

    ctx.beginPath();

    ctx.ellipse(
        -14,
        5,
        4,
        2.5,
        0,
        0,
        Math.PI * 2
    );

    ctx.ellipse(
        14,
        5,
        4,
        2.5,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* =====================================
       ARMS
       ===================================== */

    ctx.strokeStyle =
        "#e8c5ad";

    ctx.lineWidth = 12;

    ctx.lineCap = "round";

const armMove =
        Math.sin(time * .02) * 5;

    ctx.beginPath();

    ctx.moveTo(-35, 70);

    ctx.quadraticCurveTo(
        -75,
        115 + armMove,
        -65,
        175
    );

    ctx.stroke();

    ctx.beginPath();

    ctx.moveTo(35, 70);

    ctx.quadraticCurveTo(
        75,
        115 - armMove,
        65,
        175
    );

    ctx.stroke();


    /* =====================================
       DRESS SPARKLES
       ===================================== */

    if (glowEnabled) {

        for (const s of sparkles) {

            const x =
                s.x * 170;

            const y =
                s.y * 360 + 80;

            const pulse =
                .5 +
                .5 *
                Math.sin(
                    time * .06 * s.speed +
                    s.phase
                );

            if (Math.abs(x) < 190) {

                ctx.save();

                ctx.globalAlpha =
                    pulse * .75;

                ctx.fillStyle =
                    "#e9f2ff";

                ctx.shadowBlur = 8;

                ctx.shadowColor =
                    "#8db5ff";

                ctx.beginPath();

                ctx.arc(
                    x,
                    y,
                    s.size,
                    0,
                    Math.PI * 2
                );

                ctx.fill();

                ctx.restore();
            }
        }
    }


    ctx.restore();
}


/* =========================================
   VIGNETTE
   ========================================= */

function drawVignette() {

    const gradient =
        ctx.createRadialGradient(
            W / 2,
            H / 2,
            H * .20,
            W / 2,
            H / 2,
            H * .78
        );

    gradient.addColorStop(
        0,
        "rgba(0,0,0,0)"
    );

    gradient.addColorStop(
        1,
        "rgba(0,0,0,.65)"
    );

    ctx.fillStyle = gradient;

    ctx.fillRect(
        0,
        0,
        W,
        H
    );
}


/* =========================================
   ANIMATION
   ========================================= */

function animate() {

    if (!paused) {
        time += 1;
    }

    ctx.clearRect(
        0,
        0,
        W,
        H
    );

    drawBackground();

    drawForest();

    drawCharacter();

    drawVignette();

    requestAnimationFrame(animate);
}

animate();


/* =========================================
   BUTTONS
   ========================================= */

const pauseBtn =
    document.getElementById("pauseBtn");

pauseBtn.addEventListener("click", () => {

    paused = !paused;

    pauseBtn.textContent =
        paused ? "▶" : "❚❚";
});


const glowBtn =
    document.getElementById("glowBtn");

glowBtn.addEventListener("click", () => {

    glowEnabled = !glowEnabled;

    glowBtn.textContent =
        glowEnabled
            ? "✨ Glow"
            : "Glow Off";
});
