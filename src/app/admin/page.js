"use client";

import React, { useState, useEffect } from "react";
import styles from "./admin.module.css";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "modules" | "transactions" | "visitors"
  const [data, setData] = useState(null);

  // Check for saved token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("astro_admin_token");
    if (savedToken) {
      setToken(savedToken);
      fetchAnalytics(savedToken);
    }
  }, []);

  const fetchAnalytics = async (authToken) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/analytics", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      const result = await res.json();
      if (res.ok) {
        setData(result);
        setIsAuthenticated(true);
        setAuthError("");
      } else {
        // Token is invalid/expired
        localStorage.removeItem("astro_admin_token");
        setToken("");
        setIsAuthenticated(false);
        setAuthError(result.error || "Session expired. Please log in again.");
      }
    } catch (err) {
      setAuthError("Failed to connect to analytics API.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const result = await res.json();
      if (res.ok && result.success) {
        localStorage.setItem("astro_admin_token", result.token);
        setToken(result.token);
        await fetchAnalytics(result.token);
      } else {
        setAuthError(result.error || "Login failed");
      }
    } catch (err) {
      setAuthError("Failed to connect to authentication server.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("astro_admin_token");
    setToken("");
    setIsAuthenticated(false);
    setData(null);
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.starsBg}></div>
        <div className={styles.nebulaBg}></div>
        <div className={`${styles.loginCard} cosmic-card`}>
          <div className={styles.loginHeader}>
            <span className={styles.loginStar}>✦</span>
            <h1 className={styles.loginTitle}>Astro<span className={styles.goldText}>Veda</span></h1>
            <p className={styles.loginSubtitle}>Sanctuary Analytics Dashboard</p>
          </div>
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <div className={styles.inputGroup}>
              <label htmlFor="adminPassword" className={styles.label}>Admin Password</label>
              <input
                id="adminPassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className={styles.input}
                required
              />
            </div>
            {authError && <div className={styles.errorMsg}>✕ {authError}</div>}
            <button type="submit" disabled={loading} className="btn-gold pulse-button">
              {loading ? "Decrypting..." : "Enter Sanctuary ✦"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading sanctuary data...</p>
      </div>
    );
  }

  const { summary, dayWiseData, moduleWiseData, locationData, recentTransactions, recentVisits } = data;

  // Format date helper
  const formatDateString = (dateStr) => {
    const options = { month: "short", day: "numeric" };
    return new Date(dateStr).toLocaleDateString("en-US", options);
  };

  // Format timestamp helper
  const formatTime = (ts) => {
    return new Date(ts).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Helper for generating custom SVG charts
  const renderTrendChart = () => {
    const width = 800;
    const height = 280;
    const paddingLeft = 60;
    const paddingRight = 60;
    const paddingTop = 30;
    const paddingBottom = 40;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    if (!dayWiseData || dayWiseData.length === 0) return null;

    // Calculate maximum values for scaling
    const maxVisits = Math.max(...dayWiseData.map(d => d.visits + d.moduleViews), 10);
    const maxRevenue = Math.max(...dayWiseData.map(d => d.revenue), 100);

    const points = dayWiseData.map((d, index) => {
      const x = paddingLeft + (index / (dayWiseData.length - 1 || 1)) * chartWidth;
      const yVisits = height - paddingBottom - ((d.visits + d.moduleViews) / maxVisits) * chartHeight;
      const yRevenue = height - paddingBottom - (d.revenue / maxRevenue) * chartHeight;
      return { x, yVisits, yRevenue, ...d };
    });

    const visitsPath = points.map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x} ${p.yVisits}`).join(" ");
    const revenuePath = points.map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x} ${p.yRevenue}`).join(" ");

    return (
      <div className={styles.chartWrapper}>
        <div className={styles.chartLegend}>
          <div className={styles.legendItem}>
            <span className={`${styles.legendColor} ${styles.colorCyan}`}></span>
            <span>Total Views (Visits + Accordion Open)</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.legendColor} ${styles.colorGold}`}></span>
            <span>Revenue (INR)</span>
          </div>
        </div>
        <svg viewBox={`0 0 ${width} ${height}`} className={styles.svgChart}>
          <defs>
            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-gold" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="cyan-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--cyan)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="var(--cyan)" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="gold-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = paddingTop + ratio * chartHeight;
            return (
              <line
                key={idx}
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                className={styles.chartGridLine}
              />
            );
          })}

          {/* X Axis Labels */}
          {points.map((p, idx) => {
            // Label every 3rd or 4th item to avoid crowding
            const step = Math.ceil(dayWiseData.length / 7) || 1;
            if (idx % step !== 0 && idx !== dayWiseData.length - 1) return null;
            return (
              <g key={idx}>
                <line
                  x1={p.x}
                  y1={height - paddingBottom}
                  x2={p.x}
                  y2={height - paddingBottom + 5}
                  className={styles.chartAxisLine}
                />
                <text
                  x={p.x}
                  y={height - paddingBottom + 20}
                  textAnchor="middle"
                  className={styles.chartText}
                >
                  {formatDateString(p.date)}
                </text>
              </g>
            );
          })}

          {/* Left Y Axis (Visits) */}
          <text
            x={paddingLeft - 15}
            y={paddingTop - 10}
            textAnchor="end"
            className={`${styles.chartText} ${styles.textCyan}`}
          >
            Views
          </text>
          {[0, 0.5, 1].map((ratio, idx) => {
            const val = Math.round(maxVisits * ratio);
            const y = height - paddingBottom - ratio * chartHeight;
            return (
              <text key={idx} x={paddingLeft - 10} y={y + 4} textAnchor="end" className={styles.chartText}>
                {val}
              </text>
            );
          })}

          {/* Right Y Axis (Revenue) */}
          <text
            x={width - paddingRight + 15}
            y={paddingTop - 10}
            textAnchor="start"
            className={`${styles.chartText} ${styles.textGold}`}
          >
            Revenue
          </text>
          {[0, 0.5, 1].map((ratio, idx) => {
            const val = Math.round(maxRevenue * ratio);
            const y = height - paddingBottom - ratio * chartHeight;
            return (
              <text key={idx} x={width - paddingRight + 10} y={y + 4} textAnchor="start" className={styles.chartText}>
                ₹{val}
              </text>
            );
          })}

          {/* Area under lines */}
          {points.length > 0 && (
            <>
              <path
                d={`${visitsPath} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`}
                fill="url(#cyan-grad)"
              />
              <path
                d={`${revenuePath} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`}
                fill="url(#gold-grad)"
              />
            </>
          )}

          {/* Trend lines */}
          <path d={visitsPath} fill="none" stroke="var(--cyan)" strokeWidth="3" filter="url(#glow-cyan)" />
          <path d={revenuePath} fill="none" stroke="#a855f7" strokeWidth="3" filter="url(#glow-gold)" />

          {/* Interactive dots */}
          {points.map((p, idx) => {
            // Show dots on hover, or render small dots for all
            return (
              <g key={idx} className={styles.chartDotGroup}>
                <circle
                  cx={p.x}
                  cy={p.yVisits}
                  r="4"
                  fill="var(--cyan)"
                  stroke="var(--bg-color)"
                  strokeWidth="1.5"
                />
                <circle
                  cx={p.x}
                  cy={p.yRevenue}
                  r="4"
                  fill="#a855f7"
                  stroke="var(--bg-color)"
                  strokeWidth="1.5"
                />
                {/* Tooltip trigger area */}
                <rect
                  x={p.x - 10}
                  y={paddingTop}
                  width="20"
                  height={chartHeight}
                  fill="transparent"
                  className={styles.chartHoverZone}
                >
                  <title>{`${p.date}\nViews: ${p.visits + p.moduleViews}\nRevenue: ₹${p.revenue}`}</title>
                </rect>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.starsBg}></div>
      <div className={styles.nebulaBg}></div>

      {/* Admin Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.star}>✦</span>
          <span className={styles.logoText}>Astro<span className={styles.goldText}>Veda</span></span>
          <span className={styles.badge}>Admin</span>
        </div>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Exit Sanctuary ✕
        </button>
      </header>

      <main className={styles.mainContent}>
        {/* KPI Row */}
        <section className={styles.kpiRow}>
          <div className={`${styles.kpiCard} cosmic-card`}>
            <span className={styles.kpiIcon}>🪙</span>
            <div>
              <p className={styles.kpiLabel}>Total Revenue</p>
              <h3 className={`${styles.kpiValue} glow-gold`}>₹{summary.totalRevenue}</h3>
            </div>
          </div>
          <div className={`${styles.kpiCard} cosmic-card`}>
            <span className={styles.kpiIcon}>👥</span>
            <div>
              <p className={styles.kpiLabel}>Unique Visitors</p>
              <h3 className={`${styles.kpiValue} glow-cyan`}>{summary.uniqueVisitors}</h3>
            </div>
          </div>
          <div className={`${styles.kpiCard} cosmic-card`}>
            <span className={styles.kpiIcon}>👀</span>
            <div>
              <p className={styles.kpiLabel}>Page Views</p>
              <h3 className={styles.kpiValue}>{summary.totalVisits}</h3>
            </div>
          </div>
          <div className={`${styles.kpiCard} cosmic-card`}>
            <span className={styles.kpiIcon}>🔮</span>
            <div>
              <p className={styles.kpiLabel}>Module Views</p>
              <h3 className={`${styles.kpiValue} glow-magenta`}>{summary.totalModuleInteractions}</h3>
            </div>
          </div>
        </section>

        {/* Tab switcher */}
        <nav className={styles.tabNav}>
          <button
            onClick={() => setActiveTab("overview")}
            className={`${styles.tabBtn} ${activeTab === "overview" ? styles.tabBtnActive : ""}`}
          >
            Overview & Trends
          </button>
          <button
            onClick={() => setActiveTab("modules")}
            className={`${styles.tabBtn} ${activeTab === "modules" ? styles.tabBtnActive : ""}`}
          >
            Module Popularity
          </button>
          <button
            onClick={() => setActiveTab("transactions")}
            className={`${styles.tabBtn} ${activeTab === "transactions" ? styles.tabBtnActive : ""}`}
          >
            Payments Audit
          </button>
          <button
            onClick={() => setActiveTab("visitors")}
            className={`${styles.tabBtn} ${activeTab === "visitors" ? styles.tabBtnActive : ""}`}
          >
            Visitor Audit Log
          </button>
        </nav>

        {/* Tab Content */}
        <section className={styles.tabContent}>
          {activeTab === "overview" && (
            <div className={styles.overviewTab}>
              <div className="cosmic-card">
                <h2 className={styles.sectionTitle}>30-Day Activity & Sales Graph</h2>
                {renderTrendChart()}
              </div>

              <div className={styles.splitGrid}>
                {/* Countries List */}
                <div className="cosmic-card">
                  <h2 className={styles.sectionTitle}>Top Countries</h2>
                  <div className={styles.listTableContainer}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Country</th>
                          <th className={styles.textRight}>Views</th>
                        </tr>
                      </thead>
                      <tbody>
                        {locationData.countries.length === 0 ? (
                          <tr>
                            <td colSpan="2" className={styles.emptyCell}>No country data logged yet</td>
                          </tr>
                        ) : (
                          locationData.countries.map((loc, idx) => (
                            <tr key={idx}>
                              <td>📍 {loc.name}</td>
                              <td className={styles.textRight}>{loc.count}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Cities List */}
                <div className="cosmic-card">
                  <h2 className={styles.sectionTitle}>Top Cities</h2>
                  <div className={styles.listTableContainer}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>City</th>
                          <th className={styles.textRight}>Views</th>
                        </tr>
                      </thead>
                      <tbody>
                        {locationData.cities.length === 0 ? (
                          <tr>
                            <td colSpan="2" className={styles.emptyCell}>No city data logged yet</td>
                          </tr>
                        ) : (
                          locationData.cities.map((loc, idx) => (
                            <tr key={idx}>
                              <td>🌆 {loc.name}</td>
                              <td className={styles.textRight}>{loc.count}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "modules" && (
            <div className={`${styles.modulesTab} cosmic-card`}>
              <h2 className={styles.sectionTitle}>Module Performance Overview</h2>
              <p className={styles.sectionDesc}>Day-wise counts and purchase conversion per astrology module.</p>
              
              <div className={styles.barChartContainer}>
                {moduleWiseData.map((mod) => {
                  const maxVisits = Math.max(...moduleWiseData.map(m => m.visits), 1);
                  const maxRev = Math.max(...moduleWiseData.map(m => m.revenue), 1);
                  
                  return (
                    <div key={mod.name} className={styles.moduleMetricRow}>
                      <div className={styles.moduleMeta}>
                        <span className={styles.moduleName}>
                          {mod.name.toUpperCase()}
                        </span>
                        <span className={styles.moduleRevenueText}>
                          Earned: ₹{mod.revenue}
                        </span>
                      </div>
                      <div className={styles.metricBars}>
                        {/* Visits bar */}
                        <div className={styles.barWrapper}>
                          <span className={styles.barMiniLabel}>Visits ({mod.visits})</span>
                          <div className={styles.barTrack}>
                            <div
                              className={`${styles.barFill} ${styles.fillCyan}`}
                              style={{ width: `${(mod.visits / maxVisits) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        {/* Revenue bar */}
                        <div className={styles.barWrapper}>
                          <span className={styles.barMiniLabel}>Revenue (₹{mod.revenue})</span>
                          <div className={styles.barTrack}>
                            <div
                              className={`${styles.barFill} ${styles.fillGold}`}
                              style={{ width: `${(mod.revenue / maxRev) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "transactions" && (
            <div className="cosmic-card">
              <h2 className={styles.sectionTitle}>Premium Payments Audit Log</h2>
              <div className={styles.tableResponsive}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Order ID</th>
                      <th>Payment ID</th>
                      <th>Premium Module</th>
                      <th className={styles.textRight}>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.length === 0 ? (
                      <tr>
                        <td colSpan="5" className={styles.emptyCell}>No premium unlocks verified yet.</td>
                      </tr>
                    ) : (
                      recentTransactions.map((tx, idx) => (
                        <tr key={idx} className={styles.tableRowHover}>
                          <td>{formatTime(tx.timestamp)}</td>
                          <td className={styles.monoText}>{tx.orderId}</td>
                          <td className={styles.monoText}>{tx.paymentId}</td>
                          <td>
                            <span className={styles.featureBadge}>
                              🔮 {tx.featureId}
                            </span>
                          </td>
                          <td className={`${styles.textRight} glow-gold`}>₹{tx.price}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "visitors" && (
            <div className="cosmic-card">
              <h2 className={styles.sectionTitle}>Recent Activity Logs</h2>
              <div className={styles.tableResponsive}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>IP Address</th>
                      <th>Location</th>
                      <th>Interaction Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentVisits.length === 0 ? (
                      <tr>
                        <td colSpan="4" className={styles.emptyCell}>No visitor sessions tracked yet.</td>
                      </tr>
                    ) : (
                      recentVisits.map((v, idx) => (
                        <tr key={idx} className={styles.tableRowHover}>
                          <td>{formatTime(v.timestamp)}</td>
                          <td className={styles.monoText}>{v.ip}</td>
                          <td>
                            📍 {v.city}, {v.country}
                          </td>
                          <td>
                            {v.eventType === "page_view" ? (
                              <span className={styles.viewBadgePage}>
                                🏠 Page View
                              </span>
                            ) : (
                              <span className={styles.viewBadgeModule}>
                                Accordion View: <strong>{v.moduleName}</strong>
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
