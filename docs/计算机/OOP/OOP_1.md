# **C++ STL 标准模板库**

STL是C++的标准模板库，提供了非常多通用的算法和数据结构等。它分为多个组件，课程上将会介绍容器（containers，类模板、通用数据结构）、算法（algorithms）和迭代器（iterators，生成指针）。

## **Containers 容器**

### **Sequential 序列容器**
用于存储元素的序列。

=== "array"
    **静态数组**，因为是初始化时一次性分配空间，因此除了需要给出数据类型外还需要给出长度：
    ```cpp
    array<T, N>
    ```
=== "vector"
    **向量**（动态数组）。动态分配存储空间，支持自增长，因此初始化时无需给定长度，支持随机访问。末尾插入删除复杂度为$O(1)$，中间为$O(N)$

    ```cpp hl_lines="46 47"
    #include <iostream>
    #include <vector>
    using namespace std;

    int main() {
        // 创建vector
        vector<int> vec_1;       // 创建一个空向量
        vector<int> vec_2(5);    // 包含5个数，均初始化为0
        vector<int> vec_3(5, 8); // 包含5个数，均初始化为10
        vector<int> vec_4 = {1, 2, 3, 4};

        // 插入
        vec_1.push_back(8);                     // 末尾插入8
        vec_1.insert(vec_1.begin(), 10);        // 在vec_1[0]处插入10
        vec_2.insert(vec_2.begin() + 4, 5, 10); // 在vec_2[4]处插入5个10

        // 删除
        vec_1.pop_back();                                  // 删除末尾元素
        vec_2.erase(vec_2.begin() + 2);                    // 删除vec_2[2]
        vec_3.erase(vec_3.begin() + 2, vec_3.begin() + 4); // 删除vec_3[2]到vec_3[4]之间的所有元素
        vec_4.clear();                                     // 清空

        // 大小
        cout << vec_4.empty() << endl;
        cout << vec_3.size() << endl;
        vec_2.reserve(50);                // 预留空间，避免频繁分配内存
        cout << vec_2.capacity() << endl; // 实际占用的内存容量

        // 访问
        cout << vec_2[0] << endl;
        cout << vec_2.at(0) << endl;
        cout << vec_2.front() << endl;
        cout << vec_2.back() << endl;
        cout << *(vec_2.data() + 3) << endl; // .data()返回指向第一个元素的指针，+3表示vec_2[3]

        // 利用迭代器遍历vector的几种实现
        for (vector<int>::iterator it = vec_1.begin(); it < vec_1.end(); ++it)
            cout << *it << " ";
        cout << endl;
        for (auto it = vec_2.begin(); it < vec_2.end(); ++it)
            cout << *it << " ";
        cout << endl;
        for (auto it = begin(vec_3); it < end(vec_3); ++it)
            cout << *it << " ";
        cout << endl;
        for (int i: vec_4)
            cout << i << " ";
        cout << endl;
        // 除了begin()和end()之外，还有cbegin()和cend()
        // 区别在于cbegin()和cend()返回的是const_iterator，不能修改元素的值

        return 0;
    }
    ```

=== "deque"
    **双向队列**。分块存储，并非完全线性，因此虽然支持随机访问但略慢于vector。头尾插入删除复杂度为$O(1)$，中间为$O(N)$
=== "forward_list"
    **单向链表**
=== "list"
    **双向链表**。和vector的语法几乎完全一致，需要注意的点是迭代器不能比较大小，只能判断是否等于：

    ```cpp
    list<string> s;
    for (i = s.begin(); i != s.end; i++) // 这里不能写小于号
        cout << *i << " ";
    ```

    原因也非常简单，因为vector是利用数组实现的，所以比大小只需要比较一下下标即可。但list是链表，想要判断两个元素谁在后面需要一路找下去

### **Associative 关联容器**
用于存储键值对，每个元素都有一个key和一个value，通过key来组织元素

=== "set"
    **集合**。不允许重复元素
=== "map"
    **映射**。每个键映射到一个值

    ```cpp hl_lines="20 21"
    #include <iostream>
    #include <map>
    #include <string>
    using namespace std;

    int main() {
        map<string, int> price;
        price["apple"] = 10;
        price["banana"] = 20;
        price["orange"] = 30;

        string item;
        int total = 0;
        while (cin >> item && item != "exit")
            if (price.contains(item)) // 如果item在price中
                total += price[item]; // 如果item不在price中，会自动创建一个以item为键，值为0的元素

        cout << total << endl;

        for (const auto &p: price) {
            cout << "{" << p.first << "," << p.second << "}" << " ";
        }
    }
    ```

    利用map访问不存在的键时自动创建的特性，可以给出如下代码：

    ```cpp hl_lines="11 12"
    #include <iostream>
    #include <map>
    #include <string>
    using namespace std;

    int main() {
        map<string, int> word_map;
        for (const string &word: {"abandon", "ability", "about", "absent", "absorb", "abstract", "absurd"})
            ++word_map[word];   // 利用不存在就自动创建的特性

        for (const auto &[word, count]: word_map)   // 可以用[]将键和值写开
            cout << word << " " << count << endl;
    }
    ```

=== "multiset"
    **多重集合**。允许多个元素具有相同的键
=== "multimap"
    **多重映射**。存储键值对，键是唯一的，但值可以重复，允许一个键映射到多个值

### **Unordered Associative 无序容器**
用哈希表来实现快速查找、插入和删除。对应关联容器，有unordered_set、unordered_map、unordered_multiset和unordered_multimap

### **Adaptors 适配容器**

适配器可以理解为一个「转接口」，将用户的需求转接到别的基础容器上。比如说，我们可以在vector的基础上添加一些功能（入栈、出栈）来实现栈，或者说，我将用户所需要的栈的功能通过这个适配容器转接到vector上了

=== "stack"
    **栈**
    
    ```cpp hl_lines="6"
    #include <iostream>
    #include <stack>
    #include <string>
    using namespace std;

    bool isBalanced(const string& s) { // 函数中没有对s进行任何操作，因此声明为常量引用
        stack<char> st;

        for (char c: s)
            if (c == '(' || c == '{' || c == '[')
                st.push(c);
            else if (c == ')' || c == '}' || c == ']') {
                if (st.empty())
                    return false;
                if (c == ')' && st.top() != '(' || c == '}' && st.top() != '{' || c == ']' && st.top() != '[')
                    return false;
                st.pop();
            }
        return st.empty();
    }

    int main() {
        string test_1 = "a(b{c[d]e}f)g";
        string test_2 = "a(b{c[d}e]f)g";
        cout << "Test 1: " << (isBalanced(test_1) ? "Balanced" : "Not Balanced") << endl;
        cout << "Test 2: " << (isBalanced(test_2) ? "Balanced" : "Not Balanced") << endl;
        // 问好冒号表达式最外面的括号不能少
    }
    ```

=== "queue"
    **队列**

=== "priority_queue"
    **优先队列**（堆）

## **Algorithms 算法**

STL中有大量的算法，用于对容器中的元素进行操作。算法的调用不需要关注容器的类型，只需要给出操作范围即可（注意区间是前开后闭的）


## **Iterators 迭代器**

迭代器用于遍历容器中的元素，将容器和算法连接起来