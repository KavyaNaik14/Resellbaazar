import React from 'react'
import { useNavigate } from 'react-router-dom';


function Home() {

  const HighlightCards = [
    {
      value: "10K+",
      label: "Users"
    },
    {
      value: "5K+",
      label: "Items Sold"
    },
    {
      value: "2K+",
      label: "Listings"
    },
    {
      value: "300+",
      label: "Daily Deals"
    },
    {
      value: "4.8★",
      label: "Rating"
    }
  ];
  return (
    <div >
      <div className="homeSection1">
        {/* Find It. Buy It. Sell It.
The easiest way to trade used items near you */}
        <h1 className='head1'>
          Find It.<br />
          <span className='span1'>Buy It. Sell It.</span>
        </h1>
        <p className='para1'>The easiest and fastest way to trade used items near you — safe, simple, and completely free.</p>
      </div>

      <h1 className='Para2'>Our Growth</h1>
      <div className="homeSection2">
        {
          HighlightCards.map((k) => {
            return <div className='HighlightCards'>
              {/* <img src={k.image} alt="img1" width={60} height={60} /> */}
              <p className='label'>{k.label}</p>
              <p className='value'>{k.value}</p>
            </div>

          })
        }
      </div>

      <section class="homeSection3">
        <h1 class="head2">How It Works</h1>

        <div class="steps">

          <div class="step">
            <div class="icon">📷</div>
            <div class="content">
              <h2>Upload Photo</h2>
              <p className='p1'>
                Add photos and details of your used item — publish your listing in just a few seconds, completely free with no hidden charges.
              </p>
            </div>
          </div>

          <div class="step">
            <div class="icon">👥</div>
            <div class="content">
              <h2>Reach Local Buyers</h2>
              <p className='p1'>
                Your item gets visibility among nearby buyers actively searching for second-hand products in your area.
              </p>
            </div>
          </div>

          <div class="step">
            <div class="icon">💬</div>
            <div class="content">
              <h2>Chat & Close the Deal</h2>
              <p className='p1'>
                Connect with interested buyers through chat, negotiate the price, and finalize your deal quickly and easily.
              </p>
            </div>
          </div>

        </div>
      </section>

    </div>
  )
}

export default Home
