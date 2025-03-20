<style scoped>
.timer-card {
  position: relative;
  background-color: var(--white);
  border-radius: var(--border-radius-large);
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05), 0 1px 8px rgba(0, 0, 0, 0.03);
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.timer-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.05);
}

.timer-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.03);
  background: linear-gradient(145deg, var(--bg-light), #fff);
}

.timer-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0;
  color: var(--black);
  text-align: center;
  background: linear-gradient(45deg, var(--primary-color), var(--primary-dark));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: 0.5px;
}

.timer-body {
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.timer-icon {
  font-size: 3rem;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.1));
}

.timer-icon img {
  height: 80px;
  width: 80px;
  object-fit: contain;
}

.timer-card:hover .timer-icon {
  transform: scale(1.1);
  color: var(--primary-light);
}

.timer-description {
  text-align: center;
  color: var(--gray);
  line-height: 1.5;
  font-size: 1rem;
  margin-bottom: 1.5rem;
}

.timer-footer {
  padding: 1.5rem;
  background-color: rgba(0, 0, 0, 0.02);
  border-top: 1px solid rgba(0, 0, 0, 0.03);
  display: flex;
  justify-content: center;
}

.timer-button {
  padding: 0.75rem 2rem;
  background: linear-gradient(145deg, var(--primary-color), var(--primary-dark));
  color: var(--white);
  border: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-transform: uppercase;
  letter-spacing: 1px;
  width: 100%;
  max-width: 200px;
  position: relative;
  overflow: hidden;
}

.timer-button::after {
  content: "";
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  background-image: radial-gradient(circle, #fff 10%, transparent 10.01%);
  background-repeat: no-repeat;
  background-position: 50%;
  transform: scale(10, 10);
  opacity: 0;
  transition: transform .5s, opacity 1s;
}

.timer-button:active::after {
  transform: scale(0, 0);
  opacity: 0.3;
  transition: 0s;
}

.timer-button:hover {
  background: linear-gradient(145deg, var(--primary-light), var(--primary-color));
  transform: translateY(-3px);
  box-shadow: 0 7px 15px rgba(0, 0, 0, 0.2);
}

.timer-card-featured {
  position: relative;
  overflow: hidden;
}

.timer-card-featured::before {
  content: "Featured";
  position: absolute;
  top: 15px;
  right: -30px;
  background: linear-gradient(145deg, var(--success-color), var(--success-dark));
  color: white;
  padding: 5px 40px;
  transform: rotate(45deg);
  font-size: 0.8rem;
  font-weight: bold;
  z-index: 10;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .timer-header {
    padding: 1.2rem;
  }
  
  .timer-body {
    padding: 1.2rem;
  }
  
  .timer-footer {
    padding: 1.2rem;
  }
  
  .timer-title {
    font-size: 1.2rem;
  }
  
  .timer-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  .timer-icon img {
    height: 60px;
    width: 60px;
  }
  
  .timer-description {
    font-size: 0.9rem;
  }
  
  .timer-button {
    padding: 0.6rem 1.5rem;
    font-size: 0.9rem;
  }
}
</style> 