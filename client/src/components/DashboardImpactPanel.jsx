import { Link } from "react-router-dom";

/** @param {{ dash: object | null; activeLevel?: string }} props */
export default function DashboardImpactPanel({ dash, activeLevel = "Seed Saver" }) {
  if (!dash) return null;

  const trees = dash.impact?.treesPlanted ?? 0;
  const waterL = dash.impact?.waterSavedLiters ?? 0;
  const cleanups = dash.impact?.cleanupsCompleted ?? 0;

  const completedIds = Array.isArray(dash.progress?.completedSceneIds) ? dash.progress.completedSceneIds : [];
  const latestCompletedScene = completedIds.length > 0 ? completedIds[completedIds.length - 1] : null;
  const completedSceneLabel = latestCompletedScene || "No scene completed yet";

  return (
    <div className="dashboard-impact-shell">
      <section className="dashboard-impact-panel" aria-labelledby="dashboard-impact-heading">
        <div className="dashboard-impact-panel__head">
          <h2 id="dashboard-impact-heading" className="dashboard-impact-panel__heading">
            Impact Corner
          </h2>
          <span className="dashboard-level-chip dashboard-level-chip--active">{activeLevel}</span>
        </div>

        <div className="dashboard-impact-panel__kpis" role="list">
          <div className="dashboard-impact-panel__kpi" role="listitem">
            <span className="dashboard-impact-panel__kpi-icon" aria-hidden>
              🌳
            </span>
            <span className="dashboard-impact-panel__kpi-label">Trees planted</span>
            <span className="dashboard-impact-panel__kpi-value">{trees}</span>
          </div>
          <div className="dashboard-impact-panel__kpi" role="listitem">
            <span className="dashboard-impact-panel__kpi-icon" aria-hidden>
              💧
            </span>
            <span className="dashboard-impact-panel__kpi-label">Water saved</span>
            <span className="dashboard-impact-panel__kpi-value">{waterL}L</span>
          </div>
          <div className="dashboard-impact-panel__kpi" role="listitem">
            <span className="dashboard-impact-panel__kpi-icon" aria-hidden>
              🍂
            </span>
            <span className="dashboard-impact-panel__kpi-label">Cleanups done</span>
            <span className="dashboard-impact-panel__kpi-value">{cleanups}</span>
          </div>
        </div>

        <h3 className="dashboard-impact-panel__subheading">Completed Scene</h3>

        <div className="dashboard-impact-panel__task">
          <div className="dashboard-impact-panel__task-text">
            <p className="dashboard-impact-panel__task-title">{completedSceneLabel}</p>
          </div>
          <span className="dashboard-impact-panel__badge dashboard-impact-panel__badge--done">
            {latestCompletedScene ? "completed" : "pending"}
          </span>
        </div>

        <div className="dashboard-impact-panel__actions">
          <Link to="/scenes" className="dashboard-impact-panel__btn dashboard-impact-panel__btn--primary">
            Continue Journey
          </Link>
          <Link to="/forest-3d" className="dashboard-impact-panel__btn dashboard-impact-panel__btn--secondary">
            View 3D Forest
          </Link>
        </div>
      </section>
    </div>
  );
}
