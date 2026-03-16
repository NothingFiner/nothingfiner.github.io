export interface BlogPost {
  id: string;
  date: string;
  title: string;
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    date: '2024-03-16',
    title: 'Running a Local LLM in the Browser with WebGL',
    content: `
      <p>When I was messing around with WebGL to add some visual interest to my portfolio site, a thought occurred to me: this is an interface from the browser to the system's GPU. Models run on GPUs. So I wondered: could I use WebGL to run a small chatbot using a visitor's physical hardware? It would be pretty cool to have a tiny RAG chatbot on my site that answers questions about my resume.</p>

      <p>After doing a little research I discovered that the answer was yes. Running a small, quantized model like this was theoretically possible. Then I discovered that someone had already built a library to do this very thing: <a href="https://github.com/mlc-ai/web-llm" target="_blank" rel="noopener noreferrer">WebLLM</a>.</p>

      <p>I now knew I could leverage WebGL to run a tiny model through the browser and I had a library that would let me do it. After reading the docs, I wrote a prompt for Qwen code to build a custom hook that would download the model and initiate the chat. A bit of back and forth debugging later, I had a working chatbot on my portfolio site (after a sizable download).</p>

      <p>Getting answers about dinosaurs and birds through an LLM (or maybe SLM?) running locally on your computer's hardware, through a browser is cool, but not really my vision for the portfolio; I wanted a visitor to be able to ask questions about me and my qualifications. With that in mind, I set out to train an unquantized version of one of these tiny models to answer those questions.</p>

      <p>First I had to pick a model to start training. WebLLM provides a convenient reference to several quantized versions of models from various groups inside the library itself. I had started with a small version of Meta's Llama, but that required a download north of half a gigabyte. I wanted to see if I could go smaller. Several minutes of scrolling later, I found Qwen2.5-0.5B-Instruct. It wasn't the absolute smallest, but, at less than three hundred megabytes, it was noticeably smaller than the model I was using, and it was related to a model with which I had experience.</p>

      <p>I was already familiar with the basic idea of training a model: you need to construct training data and show it to the model. However, I had to do some research about how to actually accomplish this. I ran a series of searches before landing on Haystack. It was open-source and used widely.</p>

      <p>Getting Haystack working ended up being the first big roadblock of this project. My local machine was missing several libraries it required. Qwen code really struggled to resolve dependencies for it. It kept trying to downgrade versions of certain plugins and then spitting out different versions of "this plugin requires at least this version of that plugin." At one point it tried to switch to a completely different training library. I had no interest in picking another one, just to see it fail to install the dependencies for that one. I ended up having to do some old school developing and manually configure dependencies. A few hours later, though, I had it working.</p>

      <p>I'd had Qwen write me a python script to generate training data from plaintext versions of my resume. It ended up spitting out some JSONL with questions about my qualifications, but no answers.</p>

      <p>I completed the questions and I ran the training program. The good news: it answered questions about me. The bad news: it was making a lot of stuff up!</p>

      <p>Another issue was answering as if it were me - I didn't want that, so I redid the questions to reflect that and added a little context.</p>

      <p>In order to correct the issues with hallucination, I began adding more training data. To start, I asked Claude to interview me pretending to be a CTO for a company and then as someone who would ask questions about culture fit.</p>

      <p>I added more plain text from resume variations. I constructed honesty questions. I added specific question and answer sets about the subjects of its hallucinations. Unfortunately, it seemed like even after I had added 15 different questions about how I don't know C# or any C-family languages, it still occasionally said that I did.</p>

      <p>That's to say nothing of it deciding to say I have a boyfriend, a wife, and a husband at different points, instead of saying it didn't know - I tried both training data that directed it to say it didn't know, as well as data that told it to answer that I was single (just to see if that would work). Nothing seemed to fix it.</p>

      <p>I did a little more research. I started from a fresh model. I lowered the inference temperature (this ended up helping the most). The model still would not stop hallucinating and I hadn't even quantized it.</p>

      <p>It is at this point a cliche that the definition of insanity is trying the same thing repeatedly and expecting different results, but I didn't think it was wise to spend a lot of time trying to train a separate model for what was essentially a parlor trick, when I wasn't getting significant improvements. I learned a lot about how training works and the different parameters, but training a model takes time and I wanted to get my website up sooner rather than later, so I decided to take a different approach.</p>

      <p>Instead of training a new model from an existing one, I would try using my resume and information as context for the chatbot I already had working. I always knew this was an option, but it seemed less cool to me, so I had pursued the training approach. As I have learned throughout my life, sometimes the less exciting option is the better one, all things considered.</p>

      <p>Using a chat context proved immediately better. While I still was getting some hallucinations, the model was following restrictions a lot better than the custom one did in testing. It also had the added benefit of already being on the local version of my site. This let me see changes to my parameters a lot faster than when I had to wait for the model to finish training.</p>

      <p>At the moment, this ended up being little more than a parlor trick to show off on my portfolio website. One might even say that it's not a very good one! However, I did learn a lot about how models are trained and how to run a model locally in a user's browser. Right now, there isn't a clear use case for doing that, but I believe there is a lot of potential in smaller, more efficient models. In the future, we may see a technological breakthrough in memory production, which lets more and more everyday people run models locally instead of paying for a service.</p>
    `,
  },
];

export function getPostById(id: string): BlogPost | undefined {
  return blogPosts.find(post => post.id === id);
}
