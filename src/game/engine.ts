import { state } from './state';
import { SKILLS } from './skills';
import { audio } from './audio';

const PATTERNS = [
  [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
  ],
  [
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
  ],
  [
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
  ],
  [
    [0, 1, 1, 0, 0, 1, 1, 0],
    [0, 1, 1, 0, 0, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [0, 1, 1, 1, 1, 1, 1, 0],
  ],
  [
    [1, 1, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 1, 1],
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 1, 0, 0],
  ]
];

const BRICK_COLORS = [
  '#CAFFBF', '#FDFFB6', '#FFD6A5', '#FFADAD', '#BDB2FF', '#FFC6FF', '#9BF6FF', '#A0C4FF'
];

function getBrickColor(hp: number) {
  const idx = Math.min(Math.max(0, hp - 1), BRICK_COLORS.length - 1);
  return BRICK_COLORS[idx];
}

function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, color: string) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function strokeRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, color: string, lineWidth: number = 3, dashed: boolean = false) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  if (dashed) {
    ctx.setLineDash([8, 6]);
  } else {
    ctx.setLineDash([]);
  }
  ctx.stroke();
  ctx.setLineDash([]);
}

export class BreakdleEngine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  isRunning = false;
  lastTime = 0;

  paddles: { x: number, y: number, width: number, height: number, respawnTimer: number }[] = [{ x: 0, y: 0, width: 150, height: 20, respawnTimer: 0 }];
  balls: { x: number, y: number, vx: number, vy: number, radius: number, active: boolean, respawnTimer: number, deathX: number, state: Record<string, any>, isGhost?: boolean }[] = [];
  bricks: { x: number, y: number, w: number, h: number, hp: number, maxHp: number, shakeTimer?: number }[] = [];
  explosions: { x: number, y: number, radius: number, timer: number, maxTimer: number }[] = [];

  arenaRespawnTimer = 0;
  extraPaddleOffset = 0;
  mouseX = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false })!;
    this.mouseX = window.innerWidth / 2;
    this.resize();
    window.addEventListener('resize', this.resize);
    window.addEventListener('mousemove', this.onMouseMove);
    this.spawnArena();
  }

  onMouseMove = (e: MouseEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    this.mouseX = e.clientX - rect.left;
  }

  resize = () => {
    const rect = this.canvas.parentElement?.getBoundingClientRect() || { width: window.innerWidth, height: window.innerHeight };
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    
    for (let i = 0; i < this.paddles.length; i++) {
      this.paddles[i].y = i === 0 ? this.canvas.height - 80 : this.canvas.height - 140;
    }
  }

  start() {
    this.isRunning = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop);
  }

  stop() {
    this.isRunning = false;
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('mousemove', this.onMouseMove);
  }

  spawnGhostBall(x: number, y: number, vx: number, vy: number) {
    this.balls.push({
      x, y, vx: vx * 0.8, vy: vy * 0.8, radius: 8, active: true, respawnTimer: 0, deathX: x, state: {}, isGhost: true
    });
  }

  spawnArena() {
    if (state.savedBricks && state.savedBricks.length > 0) {
      this.bricks = [...state.savedBricks];
      return;
    }

    this.bricks = [];
    const pattern = PATTERNS[Math.floor(Math.random() * PATTERNS.length)];

    const rows = pattern.length;
    const cols = pattern[0].length;

    const padding = 12;
    const topOffset = 140;
    
    // Calculate brick area based on proportions
    const maxBrickAreaWidth = Math.min(this.canvas.width - 80, 1000);
    const sideOffset = (this.canvas.width - maxBrickAreaWidth) / 2;

    const brickW = (maxBrickAreaWidth - padding * (cols - 1)) / cols;
    const brickH = 40;

    const baseHP = Math.floor(10 * Math.pow(1.015, state.arenaLevel - 1));
    const extraChance = ((state.arenaLevel - 1) % 5) * 0.2;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (pattern[r][c] === 1) {
          const hp = baseHP + (Math.random() < extraChance ? 1 : 0);
          this.bricks.push({
            x: sideOffset + c * (brickW + padding),
            y: topOffset + r * (brickH + padding),
            w: brickW,
            h: brickH,
            hp: hp,
            maxHp: hp
          });
        }
      }
    }

    state.savedBricks = [...this.bricks];
    state.save();
  }

  loop = (time: number) => {
    if (!this.isRunning) return;

    const dt = Math.min((time - this.lastTime) / 1000, 0.1);
    this.lastTime = time;

    if (!state.isPaused) {
      this.update(dt * state.timeScale);
    }
    this.draw();

    requestAnimationFrame(this.loop);
  }

  update(dt: number) {
    if (state.forceRespawn) {
      state.forceRespawn = false;
      audio.playArenaReset();
      this.spawnArena();
      this.arenaRespawnTimer = 0;
    }

    for (let i = this.explosions.length - 1; i >= 0; i--) {
      this.explosions[i].timer -= dt;
      if (this.explosions[i].timer <= 0) {
        this.explosions.splice(i, 1);
      }
    }

    for (const brick of this.bricks) {
      if (brick.shakeTimer && brick.shakeTimer > 0) {
        brick.shakeTimer -= dt;
      }
    }

    const maxBalls = (state.skills.multiball ?? 0) + 1;
    const paddleWidth = 150 + (state.skills.bigPaddles ?? 0) * 20;
    const ballRespawnTime = Math.max(0, 10 - (state.skills.fastRespawn ?? 0));
    const arenaRespawnTime = Math.max(0, 30 - (state.skills.fastTravel ?? 0));
    const numPaddles = (state.skills.multipaddle ?? 0) + 1;

    while (this.paddles.length < numPaddles) {
      this.paddles.push({ x: -paddleWidth, y: this.canvas.height - 140, width: paddleWidth, height: 20, respawnTimer: 0 });
    }
    if (this.paddles.length > numPaddles) {
      this.paddles.length = numPaddles;
    }
    for (let i = 0; i < this.paddles.length; i++) {
      const p = this.paddles[i];
      p.width = paddleWidth;
      p.y = i === 0 ? this.canvas.height - 80 : this.canvas.height - 140;
    }

    const normalBalls = this.balls.filter(b => !b.isGhost);
    while (normalBalls.length < maxBalls) {
      const newBall = {
        x: this.canvas.width / 2,
        y: this.canvas.height - 150,
        vx: 0, vy: 0, radius: 10,
        active: false,
        respawnTimer: 0,
        deathX: this.canvas.width / 2,
        state: {}
      };
      this.balls.push(newBall);
      normalBalls.push(newBall);
    }
    if (normalBalls.length > maxBalls) {
      // Remove excess normal balls if needed (usually not needed due to logic above)
      let removed = 0;
      for (let i = this.balls.length - 1; i >= 0; i--) {
        if (!this.balls[i].isGhost && normalBalls.length - removed > maxBalls) {
          this.balls.splice(i, 1);
          removed++;
        }
      }
    }

    if (this.bricks.length === 0) {
      if (this.arenaRespawnTimer <= 0) {
        if (arenaRespawnTime <= 0) {
          state.arenaLevel++;
          audio.playArenaClear();
          this.spawnArena();
          state.save();
        } else {
          this.arenaRespawnTimer = arenaRespawnTime;
        }
      } else {
        this.arenaRespawnTimer -= dt;
        if (this.arenaRespawnTimer <= 0) {
          state.arenaLevel++;
          audio.playArenaClear();
          this.spawnArena();
          state.save();
        }
      }
    }

    for (let bIdx = this.balls.length - 1; bIdx >= 0; bIdx--) {
      const ball = this.balls[bIdx];
      if (!ball.active) {
        if (ball.isGhost) {
          this.balls.splice(bIdx, 1);
          continue;
        }
        ball.respawnTimer -= dt;
        if (ball.respawnTimer <= 0) {
          ball.active = true;
          state.stats.ballsSpawned += 1;
          ball.x = this.canvas.width / 2;
          ball.y = this.canvas.height - 150;
          const angle = (Math.random() - 0.5) * Math.PI / 2;
          const speed = 600;
          ball.vx = Math.sin(angle) * speed;
          ball.vy = -Math.cos(angle) * speed;
          ball.state = {};
        }
        continue;
      }

      ball.x += ball.vx * dt;
      ball.y += ball.vy * dt;

      // Wall bounce
      if (ball.x - ball.radius < 0) {
        ball.x = ball.radius;
        ball.vx *= -1;
      } else if (ball.x + ball.radius > this.canvas.width) {
        ball.x = this.canvas.width - ball.radius;
        ball.vx *= -1;
      }

      if (ball.y - ball.radius < 0) {
        ball.y = ball.radius;
        ball.vy *= -1;
      }

      if (ball.y - ball.radius > this.canvas.height || ball.x + ball.radius < -100 || ball.x - ball.radius > this.canvas.width + 100 || ball.y + ball.radius < -100) {
        // Ghost balls are removed immediately when off-screen and NEVER respawn
        if (ball.isGhost) {
          this.balls.splice(bIdx, 1);
          continue;
        }

        ball.active = false;
        ball.respawnTimer = ballRespawnTime;
        ball.deathX = ball.x;
      }

      if (!ball.isGhost) {
        for (let i = 0; i < this.paddles.length; i++) {
          const p = this.paddles[i];
          if (p.respawnTimer > 0) continue;

          if (ball.vy > 0 &&
            ball.y + ball.radius >= p.y &&
            ball.y - ball.radius <= p.y + p.height &&
            ball.x + ball.radius >= p.x &&
            ball.x - ball.radius <= p.x + p.width) {

            ball.y = p.y - ball.radius;

            const hitPoint = (ball.x - (p.x + p.width / 2)) / (p.width / 2);
            const maxAngle = Math.PI / 3;
            const angle = hitPoint * maxAngle;

            const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
            ball.vx = Math.sin(angle) * speed;
            ball.vy = -Math.cos(angle) * speed;

            ball.state = {};
            audio.playHitPaddle();

            if (i > 0) {
              const fastBarrierLevel = state.skills.fastBarrier || 1;
              p.respawnTimer = Math.max(0, 10 - (fastBarrierLevel - 1));
            }

            break;
          }
        }
      }

      for (let i = this.bricks.length - 1; i >= 0; i--) {
        const brick = this.bricks[i];
        let dx = ball.x - Math.max(brick.x, Math.min(ball.x, brick.x + brick.w));
        let dy = ball.y - Math.max(brick.y, Math.min(ball.y, brick.y + brick.h));

        if (dx * dx + dy * dy < ball.radius * ball.radius) {

          audio.playHitBlock();

          const ctx = {
            skillLevel: 0,
            damage: 1,
            random: (min: number, max: number) => Math.random() * (max - min) + min,
            randomBool: (pct: number) => Math.random() < pct,
            ballState: ball.state,
            mustBounce: true,
            isGhost: ball.isGhost ?? false,
            blockImpactHP: brick.hp,
            mustBlockDestroy: function () {
              return this.blockImpactHP <= this.damage;
            },
            explode: (radius: number, hp: number) => {
              const cx = brick.x + brick.w / 2;
              const cy = brick.y + brick.h / 2;

              this.explosions.push({
                x: cx,
                y: cy,
                radius: radius,
                timer: 0.3,
                maxTimer: 0.3
              });

              for (let j = this.bricks.length - 1; j >= 0; j--) {
                const b = this.bricks[j];
                if (b === brick) continue;

                const bcx = b.x + b.w / 2;
                const bcy = b.y + b.h / 2;
                const dist = Math.sqrt((cx - bcx) ** 2 + (cy - bcy) ** 2);

                if (dist <= radius) {
                  const actualDmg = Math.min(b.hp, hp);
                  b.hp -= hp;

                  const goldMult = 1 + (state.skills.gold_mastery || 0) * 0.1;
                  const levelMult = Math.pow(1.01, state.arenaLevel - 1);
                  const totalGold = actualDmg * goldMult * levelMult;

                  state.gold += totalGold;
                  state.stats.totalGoldEarned += totalGold;

                  if (b.hp <= 0) {
                    this.bricks.splice(j, 1);
                    state.savedBricks = [...this.bricks];
                    state.save();
                    state.stats.blocksDestroyed += 1;
                  }
                }
              }
            }
          };

          for (const skill of SKILLS) {
            if (skill.onBallHit) {
              ctx.skillLevel = state.skills[skill.id] ?? 0;
              skill.onBallHit(ctx);
            }
          }

          if (ctx.mustBounce) {
            if (Math.abs(dx) > Math.abs(dy)) {
              ball.vx = Math.abs(ball.vx) * Math.sign(dx || 1);
            } else {
              ball.vy = Math.abs(ball.vy) * Math.sign(dy || 1);
            }
          }

          const actualDamage = Math.min(brick.hp, ctx.damage);
          brick.hp -= ctx.damage;

          const goldMult = 1 + (state.skills.gold_mastery || 0) * 0.1;
          const levelMult = Math.pow(1.01, state.arenaLevel - 1);
          const totalGold = actualDamage * goldMult * levelMult;

          state.gold += totalGold;
          state.stats.totalGoldEarned += totalGold;

          if (brick.hp <= 0) {
            const idx = this.bricks.indexOf(brick);
            if (idx !== -1) {
              this.bricks.splice(idx, 1);
              state.savedBricks = [...this.bricks];
              state.save();
            }
            state.stats.blocksDestroyed += 1;
            if (this.bricks.length === 0) {
              state.stats.arenasCompleted += 1;
            }
          } else {
            brick.shakeTimer = 0.15;
          }

          state.savedBricks = this.bricks;
          state.save();

          // Spawn ghost ball on brick hit
          if (!ball.isGhost) {
            const ghostLevel = state.skills.ghost_ball ?? 0;
            if (ghostLevel > 0 && Math.random() < ghostLevel / 100) {
              this.spawnGhostBall(ball.x, ball.y, ball.vx, ball.vy);
            }
          }

          break;
        }
      }
    }

    const mainPaddle = this.paddles[0];
    const paddleCenter = mainPaddle.x + mainPaddle.width / 2;

    if (state.paddleMode === 'auto') {
      let targetX = mainPaddle.x + mainPaddle.width / 2;
      let lowestBall = null;
      for (const ball of this.balls) {
        if (ball.active && ball.vy > 0) {
          if (!lowestBall || ball.y > lowestBall.y) {
            lowestBall = ball;
          }
        }
      }
      if (lowestBall) {
        targetX = lowestBall.x;
      } else {
        targetX = this.canvas.width / 2;
      }
      mainPaddle.x += (targetX - paddleCenter) * 0.15;
    } else {
      mainPaddle.x += (this.mouseX - paddleCenter) * 0.3;
    }

    if (mainPaddle.x < 0) mainPaddle.x = 0;
    if (mainPaddle.x + mainPaddle.width > this.canvas.width) mainPaddle.x = this.canvas.width - mainPaddle.width;

    const numExtra = this.paddles.length - 1;
    if (numExtra > 0) {
      this.extraPaddleOffset += 300 * dt;
      const totalWidth = this.canvas.width + mainPaddle.width;
      this.extraPaddleOffset %= totalWidth;

      const spacing = totalWidth / numExtra;
      for (let i = 1; i < this.paddles.length; i++) {
        let x = (this.extraPaddleOffset + (i - 1) * spacing) % totalWidth;
        this.paddles[i].x = x - mainPaddle.width;
        if (this.paddles[i].respawnTimer > 0) {
          this.paddles[i].respawnTimer -= dt;
        }
      }
    }
  }

  draw() {
    const ctx = this.ctx;

    ctx.fillStyle = '#FFF5F5';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (const brick of this.bricks) {
      let offsetX = 0;
      let offsetY = 0;
      if (brick.shakeTimer && brick.shakeTimer > 0) {
        offsetX = (Math.random() - 0.5) * 6;
        offsetY = (Math.random() - 0.5) * 6;
      }
      drawRoundedRect(ctx, brick.x + offsetX, brick.y + offsetY, brick.w, brick.h, 12, getBrickColor(brick.hp));
      ctx.fillStyle = '#9D8189';
      ctx.font = '600 18px Fredoka';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(brick.hp.toString(), brick.x + offsetX + brick.w / 2, brick.y + offsetY + brick.h / 2);
    }

    // Draw explosions
    for (const exp of this.explosions) {
      const progress = 1 - (exp.timer / exp.maxTimer);
      const currentRadius = exp.radius * progress;
      const opacity = 1 - progress;

      ctx.beginPath();
      ctx.arc(exp.x, exp.y, currentRadius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 173, 173, ${opacity * 0.4})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(exp.x, exp.y, currentRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 173, 173, ${opacity})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    for (let i = 0; i < this.paddles.length; i++) {
      const p = this.paddles[i];
      if (i === 0) {
        drawRoundedRect(ctx, p.x, p.y, p.width, p.height, 10, '#A0C4FF');
      } else {
        if (p.respawnTimer > 0) {
          strokeRoundedRect(ctx, p.x, p.y, p.width, p.height, 10, 'rgba(209, 213, 219, 0.5)', 2, true);
          ctx.fillStyle = '#9D8189';
          ctx.font = '600 14px Fredoka';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${Math.ceil(p.respawnTimer)}s`, p.x + p.width / 2, p.y + p.height / 2);
        } else {
          strokeRoundedRect(ctx, p.x, p.y, p.width, p.height, 10, '#D1D5DB', 3, false);

          // Add a subtle white inner fill for the bubble effect
          ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.fill();
        }
      }
    }

    for (const ball of this.balls) {
      if (!ball.active) {
        if (ball.isGhost) continue;
        if (ball.respawnTimer > 0) {
          ctx.fillStyle = '#9D8189';
          ctx.font = '600 18px Fredoka';
          ctx.textAlign = 'center';
          ctx.fillText(`${Math.ceil(ball.respawnTimer)}s`, ball.deathX, this.canvas.height - 30);
        }
        continue;
      }
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      if (ball.isGhost) {
        ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
        ctx.fill();
      } else {
        ctx.fillStyle = '#FFC6FF';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#FFB2FF';
        ctx.stroke();
      }
    }

    if (this.arenaRespawnTimer > 0) {
      ctx.fillStyle = '#9D8189';
      ctx.font = '700 42px Fredoka';
      ctx.textAlign = 'center';
      ctx.fillText(`Next Arena in ${Math.ceil(this.arenaRespawnTimer)}s`, this.canvas.width / 2, this.canvas.height / 2);
    }
  }
}
