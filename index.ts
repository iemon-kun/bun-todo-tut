// Expressのインポート
import express from 'express';

// アプリのインスタンスを作成
const app = express();

// ミドルウェアの設定
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
// 静的ファイルのサービング
app.use(express.static('public'));

// 基本的なルーティング
app.get('/', (req, res) => {
    res.send('Welcome to the Bun ToDo Tutorial');
});

// サーバーの起動
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});


// ToDoアイテムのデータ構造の定義
interface ToDoItem {
    id: number;
    title: string;
    completed: boolean;
}

// ToDoリストのデータストアの作成
let toDoList: ToDoItem[] = [];
let currentID = 0;


// APIエンドポイントの作成
//  ToDoアイテムの追加
app.post('/todo', (req, res) => {
    const { title } = req.body;
    const newItem: ToDoItem = {
        id: ++currentID,
        title,
        completed: false,
    };
    toDoList.push(newItem);
    res.status(201).send(newItem);
});
// カールコマンドを使いブラウザでテストする場合
// curl -X POST http://localhost:3000/todo -H "Content-Type: application/json" -d '{"title": "New ToDo Item"}'


// ToDoリストの取得
app.get('/todo', (req, res) => {
    res.send(toDoList);
});

// ToDoリストの削除
app.delete('/todo/:id', (req, res) => {
    const { id } = req.params;
    toDoList = toDoList.filter(item => item.id !== Number(id));
    res.send({ message: 'ToDo item delete successfully.'});
});
// カールコマンドを使いブラウザでテストする場合
// curl -X DELETE http://localhost:3000/todo/1