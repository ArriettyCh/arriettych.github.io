# **Memory Model 内存模型**

在程序开始运行时，系统会为它分配一部分内存空间，用来存储可执行二进制文件、变量、动态分配的内存等。主要分为3个部分：

- **User Stack**：存放局部变量（local variables、函数调用参数、返回地址等），从后往前存。函数调用时存入用户栈，函数结束时清空。
- **Run-time Heap**：程序运行时`malloc`（动态分配）出来的空间。

    在heap和stack之间还有一个Memory-mapped region，用于存放库函数

- **Code / Data 数据代码段**：从头往后存。存放可执行二进制文件、全局变量、静态局部变量等。

## **变量**

### **extern**

A declaration says there will be such a variable somewhere in the whole program.
    
全局变量在函数外进行申明，增加`extern`可以让变量和函数在不同C++文件间共享（要将两个文件同时编译）

=== "main.cpp"
    ```cpp hl_lines="1"
    extern int globalx; // 申明全局变量
    double pi();

    int main() {
        cout << "globalx" = << globalx << endl;
        cout << "pi" = << pi() << endl;
    }
    ```
=== "another.cpp"
    ```cpp
    // 定义全局变量和函数
    int globalx = 10;
    double pi() {
        return 3.14;
    }
    ```

### **static**

1. **限定作用范围**：将变量和函数的作用范围限定在本C++文件内
  
    如果将上面的`another.cpp`文件改为下面这样，运行`main.cpp`时会提示找不到`globalx`变量和`pi()`函数

    ```cpp hl_lines="2"
    static int globalx = 10;
    static double pi() {
        return 3.14;
    }
    ```

2. **static local vars**：多次访问函数时，保持变量状态。因为`static`的存储是永久性的
   
    ```cpp hl_lines="2"
    void access_count() {
        static int count = 0;
        cout << "access count: " << ++count << endl;
    }

    int main() {
        for (int i = 0; i < 10; ++i)
            access_count();
    }
    ```

    这个程序返回的结果是0～9，如果去掉`static`则会返回10个0

### **Pointer 指针**

- **指针创建**：如果只是定义一个指针而不赋值，指针的值是未知的（因系统的内存状态而异）
    ```cpp
    string s;   // s就代表字符串本身，在创建时系统会为其分配空间并自动初始化
    string *ps; // ps是一个指针，创建时其指向的对象未知
    ps = &s;
    ```
- **调用函数**：`变量.函数`或`指针->函数`
    ```cpp
    int len1 = (*ps).lenth(); // get the object
    int len2 = ps->lenth();   // call the function
    ```
- **Assignment**：指针对指针赋值不会改变其指向对象的值，而会让两个指针都指向同一个位置
    ```cpp
    string s1, s2;
    s1 = s2; // 将s2的值复制给s1

    string *ps1, *ps2;
    ps1 = ps2; // ps1指向和ps2相同的位置
    ```

### **Reference 引用**

- **引用的定义**：引用相当于给某个变量取了一个别名，定义引用之后两个变量就相当于是同一个东西了
    ```cpp hl_lines="3"
    char c;
    char *p = &c;
    char &r = c;
    ```
    一般来说，引用在定义时需要赋一个初始值，就像上面这样。parameter list（函数参数表）和member variable（class中的成员变量）则先给出一个空引用而不赋值

    ```cpp
    void f(int &x);
    f(y); // 只有调用了这个函数时才能知道x到底要绑定到哪个变量上
    ```

- **引用的使用**：引用不能重定义，非const引用必须绑定lvalue（左值，可以简单理解为能够放在等号左边的值为左值），不能双重引用，不能用指针指向引用，array中不能放引用
    ```cpp hl_lines="2 5 7"
    int &y = x;
    y = z; // 这样不会让y绑定到z上，而是让x的值和z相等

    void func(int &);
    func(i * 3); // Error!

    int &*p; // Illegal
    ```
    在函数的调用中，引用还可以起到类似指针的作用，在函数中对函数外的值进行修改
    ```cpp
    void swap(int &x, int &y) {
        int t = x;
        x = y;
        y = t;
    } // 函数运行后，传入函数的两个外变量的值互换
    ```

- **引用返回**：在函数中，返回值可以是一个引用
    ```cpp hl_lines="2"
    int x
    int &h() {
        int q;
        return q; // Error，q是局部变量，函数运行完就消失了，没法引用
        return x;
    }
    ```

    ??? question "函数引用有什么用？"

        我们以一个计数函数为例：
        ```cpp
        int count() {
            static int n = 0;
            n++
            return n;
        }
        ```
        这个函数虽然可以实现功能，但每次返回时都需要创建一个临时变量，将`n`复制回去。但如果我们使用引用来进行返回，每次返回的就都是`n`的引用，避免了变量的复制
        ```cpp hl_lines="1"
        int &count() {
            static int n = 0;
            n++;
            return n;
        }
        ```

### **指针和引用的对比**

<div class="grid cards" markdown>

-   __指针__

    - 独立存在，可以不初始化
    - 可以绑定到不同对象
    - 可以设定为null

-   __引用__

    - 不独立存在，创建时必须初始化
    - 不能重新绑定
    - 不能设定为null

</div>

## **new & delete**

`new`和`malloc`、`delete`和`free`的功能类似，不同之处在于，`new`和`delete`可以保证Ctor/Dtor函数的正确调用

```cpp hl_lines="7 9"
int *a = new int;
int *b = new int[10];
Student *c = new Student();
Student *d = new Student[10];

delete a;
delete[] b;
delete c;
delete[] d;
```

在使用`new`和`delete`时需要注意下面几点：

- `new`出来的东西记得及时`delete`掉；
- 不能混用`new`、`delete`和`malloc`、`free`；
- 不能`delete`同一个block两次；
- `delete`一个`null`的指针是安全的

## **Const 常量**

在定义变量前加上`const`，可以将其规定为常量，常量的值不能发生变化。常量的使用规则总结为一句话就是，可以将变量当常量用，但不能将常量当变量用

### **常量的存储**

编译器会尽可能减小常量占用的存储空间，对于下面第一行这样给定初值的常量，不会为其开辟作为变量的存储空间，而是会存在符号表中；但如果是extern declaration（比如这个常量是`cin`进来的，那么编译时就无法得知其真实值，就只能为其分配变量空间）

```cpp hl_lines="1 2 8 9"
const int x = 123; // 存入符号表
int array[x];      // Correct
x = 27; // Illegal
x++;    // Illegal

int in;
cin >> in;
const int y = in;   // 存为变量
int array[y];       // Error
```

### **常量指针**

- **`const`写在`*`之后**：表示指针是常量，它指向的地址不能改
- **`const`写在`*`之前**：表示(*p)是常量，不能通过指针改指向地址的值（注意`const int *`和`int const *`是一样的）

```cpp hl_lines="3 7"
int a[] = {53,54,55};

int * const p = a; // p是常量，指向的地址不能改
*p = 20;           // OK
p++;               // Error

const int *p = a; // (*p)是常量，它的值不能改
*p = 20;          // Error
p++;              // OK
```

此外，需要注意变量指针不能绑定常量。不然就可以通过这个变量指针去修改常量的值了（而且如果是存在符号表里的常量，连正常的地址都没有）

```cpp hl_lines="8"
int i;
const int ci = 3;

int *ip;
const int *cip;

ip = &i;   // 变量指针绑变量
ip = &ci;  // 变量指针绑常量，Error
cip = &i;  // 常量指针绑变量
cip = &ci; // 常量指针绑常量
```

### **string & const**

在下面代码中，`"hello"`是一个常量，编译时就已经存好，和可执行二进制文件存在同一块区域，是只读的。因此不能让一个变量指针指向它

```cpp hl_lines="2"
char s1[] = "Hello";      // 经典用法
char *s2 = "Hello";       // Error
const char *s3 = "Hello"; // Correct
```

### **常量传递**

在调用函数时，如果没有对传入的参数进行修改，可以采用常量传递，避免多余的复制（尤其是当传入参数开销较大时）

```cpp hl_lines="11 15"
struct Student {
    int id;
    char address[1000];
};

// 需要复制Student，开销较大
void f1(Student s) {
    cout << s.id << endl;
}

void f2(const Student *ps) {
    cout << ps->id << endl;
}

void f3(const Student &rs) {
    cout << rs.id << endl;
}
```