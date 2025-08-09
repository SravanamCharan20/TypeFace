class Node{
    constructor(key,value){
        this.key = key
        this.value = value
        this.prev = null
        this.next = null
    }
};

class Cache{
    constructor(capacity){
        this.head = new Node(null,null);
        this.tail = new Node(null,null);
        this.head.next = this.tail;
        this.tail.prev = this.head;
        this.map = new Map();
        this.capacity = capacity;
    }

    remove(node){
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    add_to_front(node){
        node.prev = this.head;
        node.next = this.head.next;
        this.head.next.prev = node;
        this.head.next = node;
    }

    set(key,value){
        let node;
        if(this.map.has(key)){
            node = this.map.get(key);
            this.remove(node);
            node.value = value;
        }
        else{
            if(this.capacity === this.map.size){
                let Lru_node = this.tail.prev;
                this.remove(Lru_node);
                this.map.delete(Lru_node.key);
            } 
            node = new Node(key,value);
            this.map.set(key, node);
        } 
        this.add_to_front(node); 
    }


    get(key){
        if(this.map.has(key)){
            let node = this.map.get(key)
            this.remove(node);
            this.add_to_front(node);
            return node.value;
        }
        else{
            return -1;
        }
    }
};


export default maggie = new Cache(3);

maggie.set(1,'meghana');
maggie.set(2,'charan');
maggie.set(3,'bantu');

console.log(maggie.get(1));

maggie.set(2,'bhavya');
maggie.set(4,'lucky');

console.log(maggie.get(3));


