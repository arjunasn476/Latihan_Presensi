const db = require('../config/db');

exports.attend = (req, res) => {
  const user_id = req.user.id;
  const now = new Date();

  db.query(
    "INSERT INTO attendance (user_id, date, status) VALUES (?, ?, ?)",
    [user_id, now, "Hadir"],
    (err, result) => {
      return res.json({
        status: "success",
        message: "Presensi berhasil dicatat",
        data: {
          attendance_id: result.insertId,
          user_id,
          date: now.toISOString().split("T")[0],
          time: now.toTimeString().split(" ")[0]
        }
      });
    }
  );
};

exports.monthSummary = (req, res) => {
  const { user_id } = req.params;
  const month = new Date().toISOString().slice(0,7);

  db.query(`
    SELECT 
      SUM(status='Hadir') hadir,
      SUM(status='Izin') izin,
      SUM(status='Sakit') sakit,
      SUM(status='Alpha') alpa
    FROM attendance
    WHERE user_id=?
  `,[user_id], (err, rows) => {
    const row = rows[0];
    res.json({
      status: "success",
      data: {
        user_id: Number(user_id),
        month,
        attendance_summary: {
          hadir: row.hadir || 0,
          izin: row.izin || 0,
          sakit: row.sakit || 0,
          alpa: row.alpa || 0
        }
      }
    });
  });
};

exports.analysis = (req, res) => {
  const { start_date, end_date } = req.body;

  db.query(`
    SELECT 
      'Semua' as \`group\`,
      COUNT(DISTINCT users.id) as total_users,
      SUM(status='Hadir') hadir,
      SUM(status='Izin') izin,
      SUM(status='Sakit') sakit,
      SUM(status='Alpha') alpa
    FROM users
    LEFT JOIN attendance ON attendance.user_id = users.id
      AND date BETWEEN ? AND ?
  `,[start_date, end_date], (err, rows) => {
    const r = rows[0];
    const total = (r.hadir||0)+(r.izin||0)+(r.sakit||0)+(r.alpa||0);

    res.json({
      status: "success",
      data: {
        analysis_period: { start_date, end_date },
        grouped_analysis: [{
          group: "Semua",
          total_users: r.total_users,
          attendance_rate: {
            hadir_percentage: total ? (r.hadir/total)*100 : 0,
            izin_percentage: total ? (r.izin/total)*100 : 0,
            sakit_percentage: total ? (r.sakit/total)*100 : 0,
            alpa_percentage: total ? (r.alpa/total)*100 : 0
          },
          total_attendance: {
            hadir: r.hadir||0,
            izin: r.izin||0,
            sakit: r.sakit||0,
            alpa: r.alpa||0
          }
        }]
      }
    });
  });
};

exports.history = (req, res) => {
  const { user_id } = req.params;

  db.query(
    "SELECT id, date, status FROM attendance WHERE user_id=? ORDER BY date DESC",
    [user_id],
    (err, rows) => {
      if (err) return res.status(500).json({ status: "error", message: "Gagal mengambil riwayat" });

      res.json({
        status: "success",
        data: rows
      });
    }
  );
};
