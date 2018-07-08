---
title: C# | 多线程编程
date: 2017-07-21 21:15:27
tags: ["CSharp", "读书笔记"]
categories: "CSharp"
---

学习一下C#的多线程库的一些基本操作，了解多线程工作的适用场景以及某些情况下的解决方案

<!--more-->

- 多线程的方法一般是由  System.Threading 命名空间来提供的

- 常用类可以参考

  [System.Threading 命名空间]: https://msdn.microsoft.com/zh-cn/library/system.threading(v=vs.110).aspx

### 1. System.Threading.Thread 类

这是用于控制线程的基础类，可以通过这个类来操作线程。

以下是其中比较重要的属性：

​	`ManagedThreadId` 线程唯一标识符

​	`ThreadState` 检测线程状态



下面是一个线程的简单例子

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Threading;

namespace Threadtest {
    class Program {
        static void Main(string[] args) {
            Console.WriteLine("MainThreadId is " + Thread.CurrentThread.ManagedThreadId);
            Message message = new Message();
            Thread threadone = new Thread(new ThreadStart(message.ShowMessage));
            //threadone.IsBackground = true;//线程后台运行
            threadone.Start();
            Console.WriteLine("Main");
            //Console.ReadLine();
            threadone.Join();//直到线程调用结束才继续
            Thread.Sleep(1000);
        }
    }

    public class Message {
        public void ShowMessage() {
            string message = string.Format("id:{0}", Thread.CurrentThread.ManagedThreadId);
            Console.WriteLine(message);
            for(int n = 0; n < 10; n++) {
                Thread.Sleep(300);
                Console.WriteLine("num is " + n.ToString());
            }
        }
    }
}
```



上面说明了如何让线程后台运行的threadone.IsBackground = true;

这个属性的作用就是使得主线程不必等后台线程执行完毕才结束，可以比后台线程提前结束。

还有直到线程调用结束才继续的 threadone.Join();





```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Threading;

namespace Threadtest {
    class Program {
        static void Main(string[] args) {
            Console.WriteLine("MainThreadId is " + Thread.CurrentThread.ManagedThreadId);
            Message message = new Message();
            Thread threadone = new Thread(new ThreadStart(message.ShowMessage));
            //threadone.IsBackground = true;//线程后台运行
            threadone.Start();
            Console.WriteLine("Main");
            //Console.ReadLine();
            threadone.Join();//直到线程调用结束才继续
            Thread.Sleep(1000);
        }
    }

    public class Message {
        public void ShowMessage() {
            try {
                string message = string.Format("id:{0}", Thread.CurrentThread.ManagedThreadId);
                Console.WriteLine(message);
                for (int n = 0; n < 10; n++) {
                    Thread.Sleep(300);
                    Console.WriteLine("num is " + n.ToString());
                    if (n == 5) {
                        Thread.CurrentThread.Abort(n);//抛出异常
                    }
                }
            } catch (ThreadAbortException ex) {
                if (ex.ExceptionState != null) {
                    Console.WriteLine(string.Format("stop in {0}", ex.ExceptionState.ToString()));
                    Thread.ResetAbort();//继续进程
                }
            }
            Console.WriteLine("go on!"); Thread.Sleep(300);
            Console.WriteLine("go on!"); Thread.Sleep(300);
            Console.WriteLine("go on!"); Thread.Sleep(300);
            Console.WriteLine("go on!"); Thread.Sleep(300);
        }
    }
}
```



上面的代码演示了终止进程和继续进程的方法

Thread.CurrentThread.Abort(n);是抛出异常的语句，n是错误参数。

同样我们也可以在主进程里面通过调用 threadone.Abort(5);来中断进程，

注意，这里必须包含一个参数，不然的话就会调用无参数的catch，由于上面程序没有添加这个，所以不能继续进程，从而直接结束进程。

Thread.ResetAbort(); 这是继续执行进程的语句，没有这句的话整个进程就会结束，不会继续进行。



附加关于catch的用法

> 如果try发生了异常，则转入catch的执行。catch有几种写法： 
> catch 
> 这将捕获任何发生的异常。 
> catch(Exception e) 
> 这将捕获任何发生的异常。另外，还提供e参数，你可以在处理异常时使用e参数来获得有关异常的信息。 
> catch(Exception的派生类 e) 
> 这将捕获派生类定义的异常，例如，我想捕获一个无效操作的异常，可以如下写： 
> catch(InvalidOperationException e) 
> { 
>     .... 
> } 
> 这样，如果try语句块中抛出的异常是InvalidOperationException，将转入该处执行，其他异常不处理。 
>
> catch可以有多个，也可以没有，每个catch可以处理一个特定的异常。.net按照你catch的顺序查找异常处理块，如果找到，则进行处理，如果找不到，则向上一层次抛出。如果没有上一层次，则向用户抛出，此时，如果你在调试，程序将中断运行，如果是部署的程序，将会中止。 
>
> 如果没有catch块，异常总是向上层（如果有）抛出，或者中断程序运行。 



我们再来看一段代码

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Threading;

namespace Threadtest {
    class Program {
        static void Main(string[] args) {
            Console.WriteLine("MainThreadId is " + Thread.CurrentThread.ManagedThreadId);
            myprinter print1 = new myprinter();
            Thread[] threads = new Thread[10];
            for (int i = 0; i < 10; ++i) {
                threads[i] = new Thread(new ThreadStart(print1.PrinfNum));
                threads[i].Name = i.ToString() + " thread";
            }
            foreach (Thread t in threads) {
                t.Start();
            }
            Console.ReadLine();
        }
    }

    public class myprinter {
        public void PrinfNum(){
            Console.WriteLine("No.{0} thread is runing!", Thread.CurrentThread.Name);
            Thread.Sleep(100);
            for(int i = 0; i < 10; ++i) {
                Console.WriteLine("{0} ", i);
            }
        }
    }
}
```

这段代码同时调用了10个进程，输出输出0-9，但是结果却是意料之外的。



结果显示输出的数字都是混乱没有顺序可言的，这就是线程之间的不同步所导致。



所以现在我们需要一个方法，可以阻塞调用线程，同步访问进程



```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Threading;

namespace Threadtest {
    class Program {
        static void Main(string[] args) {
            Console.WriteLine("MainThreadId is " + Thread.CurrentThread.ManagedThreadId);
            myprinter print1 = new myprinter();
            Thread[] threads = new Thread[10];
            for (int i = 0; i < 10; ++i) {
                threads[i] = new Thread(new ThreadStart(print1.PrinfNum));
                threads[i].Name = i.ToString() + " thread";
            }
            foreach (Thread t in threads) {
                t.Start();
                //t.Join();
            }
            for (int i = 0; i < 100; ++i) {
                //Console.WriteLine("time:{0} ", i);
                Thread.Sleep(100);
            }
            Console.ReadLine();
        }
    }

    public class myprinter {
        public void PrinfNum(){
            lock (this) {
                Console.WriteLine("No.{0} thread is runing!", Thread.CurrentThread.Name);
                //Thread.Sleep(500);
                for (int i = 0; i < 10; ++i) {
                    Console.Write("{0} ", i);
                }
                Console.WriteLine();
            }
            for (int i = 10; i < 20; ++i) {
                Console.Write("{0} ", i);
            }
            Console.WriteLine();

        }
    }
}
```

我们使用了C#中lock的关键字，使得lock范围类的代码是处于一个安全的进程，不与其他进程所共享，而在lock范围之外的代码就又可以和其他进程同时执行导致混乱。

这里关注一下lock里面的this，他是一个对象标记（必须是对象，不能是int等基本类型（会发生封装）或字符串（暂留）），会使得同一标记的代码不会同时执行。

其实如果你需要使得整个线程处于安全状态，那么你可能会调用t.Join();等待进程执行完毕，不过这样为什么不用单进程而用多进程呢？这里需要注意的是lock的作用并不会作用与主进程，子进程依然和main在两条时间线上执行。

lock的一些用法：

> lock(objectA){codeB} 看似简单，实际上有三个意思，这对于适当地使用它至关重要：
>
> 1. objectA被lock了吗？没有则由我来lock，否则一直等待，直至objectA被释放。
> 2. lock以后在执行codeB的期间其他线程不能调用codeB，也不能使用objectA。
> 3. 执行完codeB之后释放objectA，并且codeB可以被其他线程访问。







2017-3-12

除此之外，还有System.Threading.Interlocked类、Moniter类、 Mutex类、 ReaderWriterLock类 是类似于lock类的一些类，但是又与lock有些不同，每一种类都有这自己的特性，至于用哪一个类就要看情况了。



如果想限制一个类只能同时被一个线程访问，那就可以通过**添加属性**并且**继承**System.ContextBoundObject类来实现

```c#
[System.Runtime.Remoting.Contexts.Synchronization]
public class myprinter : System.ContextBoundObject {
        public void PrinfNum(){
            Console.WriteLine("No.{0} thread is runing!", Thread.CurrentThread.Name);
            for (int i = 0; i < 10; ++i) {
                Thread.Sleep(100);
                Console.Write("{0} ", i);
            }
            Console.WriteLine();
            for (int i = 10; i < 20; ++i) {
                Console.Write("{0} ", i);
            }
            Console.WriteLine();
        }
    }
}
```

还有一种方法也是可以实现类似的功能 MethodImplAttribute

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using System.Runtime.CompilerServices;//引用头文件
namespace Threadtest {
    class Program {
        static void Main(string[] args) {
            Console.WriteLine("MainThreadId is " + Thread.CurrentThread.ManagedThreadId);
            myprinter print1 = new myprinter();
            Thread[] threads = new Thread[10];
            for (int i = 0; i < 10; ++i) {
                threads[i] = new Thread(new ThreadStart(print1.PrinfNum));
                threads[i].Name = i.ToString() + " thread";
            }
            foreach (Thread t in threads) {
                t.Start();
                //t.Join();
            }
            object abc = new object();
            lock (abc) {
                for (int i = 0; i < 100; ++i) {
                    Console.WriteLine("time:{0} ", i);
                    Thread.Sleep(100);
                }
            }

            Console.ReadLine();
        }
    }

    public class myprinter : System.ContextBoundObject {
        [MethodImpl(MethodImplOptions.Synchronized)]//给类加上属性
        public void PrinfNum() {
            Console.WriteLine("No.{0} thread is runing!", Thread.CurrentThread.Name);
            for (int i = 0; i < 10; ++i) {
                Thread.Sleep(100);
                Console.Write("{0} ", i);
            }
            Console.WriteLine();
            for (int i = 10; i < 20; ++i) {
                Console.Write("{0} ", i);
            }
            Console.WriteLine();
        }
    }
}
```



- 同步事件和等待句柄

```c#
static AutoResetEvent autoEvent;//声明状态变量
autoEvent.WaitOne();//等待句柄
autoEvent.Set();//开始运行
```

使用以上方法有一个前提就是需要事件在同一class里面





- 关于多线程最大一个问题应该就是死锁了吧，避免死锁最好就是不要同时获取多个锁，如果一定要的话就需要用巧妙的方法咯





- ## 自动控制多个线程

  ​

如果程序里面有多个线程需要执行，我们可以交给系统的线程池进行自动管理。线程池可以优化线程执行过程，提高数据的吞吐量。但是如果对线程有特殊的控制要求的话就不合适使用线程池。



线程池一个特点就是自动化，只需要把线程交给线程池，其他管理运行都不用管，但是这又丧失了一定的控制能力。



- 每个程序域里面只能有一个threadpool

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using System.Runtime.CompilerServices;
namespace Threadtest {
    class Program {

        static void Main(string[] args) {
            Console.WriteLine("MainThreadId is " + Thread.CurrentThread.ManagedThreadId);
            Program print1 = new Program();
            Thread[] threads = new Thread[10];
            foreach (Thread t in threads) {
                ThreadPool.QueueUserWorkItem(new WaitCallback(print1.PrinfNum));
            }
            Console.ReadLine();
        }

        public void PrinfNum(object obj) {
            Console.WriteLine("No.{0} thread is runing!", Thread.CurrentThread.Name);
            for (int i = 0; i < 10; ++i) {
                Thread.Sleep(100);
                Console.Write("{0} ", i);
            }
            Console.WriteLine();
            for (int i = 10; i < 20; ++i) {
                Console.Write("{0} ", i);
            }
            Console.WriteLine();
        }
    }
}
```

这里注意的是，线程池架构只允许给函数传递一个对象，如果需要传递多个值，就需要把值包装给一个类的对象作为参数传递给QueueUserWorkItem方法。

