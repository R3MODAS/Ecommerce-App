const ProductDescription = () => {
  return (
    <div className="mt-20">
      <div className="flex gap-3 mb-4">
        <button className="btn_dark_rounded !rounded-none !text-xs !py-[6px] w-36">Description</button>
        <button className="btn_dark_outline !rounded-none !text-xs !py-[6px] w-36">Care Guide</button>
        <button className="btn_dark_outline !rounded-none !text-xs !py-[6px] w-36">Size Guide</button>
      </div>
      <div className="flex flex-col pb-16">
        <p className="text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima id dignissimos culpa ducimus provident tempore vel. Perspiciatis facilis dignissimos rerum libero obcaecati sit temporibus repellendus, deleniti voluptatum odit delectus vel veniam quaerat minus magnam similique incidunt error animi distinctio ducimus iste sequi. Repudiandae asperiores, magnam nihil deleniti numquam accusamus dignissimos aut possimus, qui provident libero.</p>
        <p className="text-sm">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non magni quidem velit nulla accusamus, aspernatur incidunt esse. Quos unde facilis sit iure maiores dolore consectetur. Totam, repudiandae. Nulla?</p>
      </div>
    </div>
  )
}

export default ProductDescription