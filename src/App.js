import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [friendList, setFriendList] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleAddFriend() {
    setShowAddFriend((prev) => !prev);
  }

  function handleAddFriendToList({ friend }) {
    setFriendList((prev) => [...prev, friend]);
    setShowAddFriend((prev) => !prev);
  }

  function handleSelectFriend(friend) {
    setSelectedFriend(friend);
    setShowAddFriend(false);
  }

  function handleSplitAmt(splitAmt) {
   // console.log(splitAmt);
    setFriendList((friends) =>
      friends.map((friend) => {
        if (friend.id === selectedFriend.id) {
          friend = { ...friend, balance: friend.balance + splitAmt };
        }
        return friend;
      })
    );
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friendList}
          onSelectFriend={handleSelectFriend}
          selectedFriend={selectedFriend}
        />
        {showAddFriend && (
          <AddFriendToList onAddFriend={handleAddFriendToList} />
        )}
        <Button onClick={handleAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <SplitBill friend={selectedFriend} splitBillAmt={handleSplitAmt} />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelectFriend, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          key={friend.id}
          friend={friend}
          onSelectFriend={onSelectFriend}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelectFriend, selectedFriend }) {
  const isFriendSelected = selectedFriend?.id === friend.id;

  return (
    <li className={isFriendSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3> {friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ₹{Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ₹{Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button onClick={() => onSelectFriend(friend)}>
        {isFriendSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function AddFriendToList({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleAddFriend(e) {
    e.preventDefault();
    if (!name || !image) {
      alert("Please fill all the fields");
      return;
    }
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?u=${id}`,
      balance: 0,
    };
    console.log(newFriend);
    onAddFriend({ friend: newFriend });
    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleAddFriend}>
      <label htmlFor="name">Name</label>
      <input
        type="text"
        id="name"
        value={name}
        required
        onChange={(el) => setName(el.target.value)}
      />
      <label htmlFor="image">Image URL</label>
      <input
        type="text"
        id="image"
        value={image}
        required
        onChange={(el) => setImage(el.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function SplitBill({ friend, splitBillAmt }) {
  const [bill, setBill] = useState("");
  const [myExpense, setMyExpense] = useState("");
  const friendExpense = myExpense ? bill - myExpense : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleBillSplit(e) {
    e.preventDefault();
    if (!bill || !myExpense) {
      alert("Please fill all the fields");
      return;
    }
    if (Number(myExpense) > Number(bill)) {
      alert("Your expense cannot be greater than the bill");
      return;
    }
    if (Number(myExpense) < 0) {
      alert("Your expense cannot be negative");
      return;
    }
    if (Number(bill) < 0) {
      alert("Bill cannot be negative");
      return;
    }
    splitBillAmt(whoIsPaying === "user" ? friendExpense : -myExpense);
  }

  return (
    <form className="form-split-bill" onSubmit={handleBillSplit}>
      <h2>Split bill with {friend.name}</h2>

      <label htmlFor="bill">Bill value</label>
      <input
        type="text"
        id="bill"
        value={bill}
        onChange={(el) => setBill(Number(el.target.value))}
        required
      />

      <label htmlFor="myExp">Your expense</label>
      <input
        type="text"
        id="myExp"
        value={myExpense}
        onChange={(el) =>
          setMyExpense(
            Number(el.target.value) > bill ? myExpense : Number(el.target.value)
          )
        }
        required
      />

      <label htmlFor="frExp">{friend.name}'s expense</label>
      <input type="text" id="frExp" value={friendExpense} required disabled />

      <label htmlFor="bill">Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(el) => setWhoIsPaying(el.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{friend.name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}
