const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("CREATE TABLE users (id INT, username TEXT, email TEXT)");

  const stmt = db.prepare("INSERT INTO users VALUES (?, ?, ?)");
  stmt.run(1, 'usuario1', 'usuario1@example.com');
  stmt.run(2, 'usuario2', 'usuario2@example.com');
  stmt.finalize();

  db.each("SELECT id, username, email FROM users", (err, row) => {
    console.log(`${row.id}: ${row.username} - ${row.email}`);
  });
});

db.run(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY,
    title TEXT,
    content TEXT,
    author TEXT,
    date TEXT,
    htmlCode TEXT,
    cssCode TEXT,
    jsCode TEXT
  )
`);

const newPost = {
  title: 'Mi nueva publicación',
  content: 'Contenido de la publicación',
  author: 'Usuario',
  date: '2023-07-28',
  htmlCode: '<div>Hello, world!</div>',
  cssCode: 'div { color: red; }',
  jsCode: 'console.log("Hello, world!");'
};

db.run(
  'INSERT INTO posts (title, content, author, date, htmlCode, cssCode, jsCode) VALUES (?, ?, ?, ?, ?, ?, ?)',
  [
    newPost.title,
    newPost.content,
    newPost.author,
    newPost.date,
    newPost.htmlCode,
    newPost.cssCode,
    newPost.jsCode
  ],
  function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Nueva publicación con el ID ${this.lastID} insertada`);

    // Consulta y muestra todas las publicaciones
    db.all('SELECT * FROM posts', [], (err, rows) => {
      if (err) {
        throw err;
      }
      rows.forEach(row => {
        console.log(row);
      });

      // Cerrar la conexión a la base de datos al final
      db.close(err => {
        if (err) {
          return console.error(err.message);
        }
        console.log('Conexión a la base de datos cerrada');
      });
    });
  }
);
