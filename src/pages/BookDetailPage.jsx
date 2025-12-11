import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Button, Badge } from "react-bootstrap";
import { COLORS } from "../theme";
import { useDispatch, useSelector } from "react-redux";
import { borrowBookAction } from "../features/borrow/borrowAction";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements } from "@stripe/react-stripe-js";
import PaymentComponent from "../components/PaymentComponent";

const BookDetailPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [book, setBook] = useState({});
  const { pubbooks } = useSelector((state) => state.bookStore);
  const { user } = useSelector((state) => state.authStore);
  const [isPaying, setIsPaying] = useState(false);

  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

  const [options, setOptions] = useState({});

  // // static mock
  // const book = {
  //   id,
  //   title: "Clean Code",
  //   author: "Robert C. Martin",
  //   year: 2008,
  //   rating: 4.5,
  //   image: "https://images.pexels.com/photos/301920/pexels-photo-301920.jpeg",
  // };

  useEffect(() => {
    let tempBook = pubbooks.find((item) => item._id == id);
    setBook(tempBook);
  }, [pubbooks]);

  const handleBorrow = async (id) => {
    const response = await dispatch(borrowBookAction(id));

    if (response.status == "success") {
      setOptions({
        clientSecret: response.clientSecret,
        appearance: { theme: "stripe" },
      });
      setIsPaying(true);
    } else setIsPaying(false);
  };

  if (book) {
    return (
      <div
        style={{
          backgroundColor: COLORS.background,

          padding: "2rem 0",
        }}
      >
        <Container>
          <Row>
            <Col md={4}>
              <img
                src={book.thumbnail}
                alt={book.title}
                style={{ width: "100%", borderRadius: "0.75rem" }}
              />
            </Col>
            <Col md={8} className="mt-4 mt-md-0">
              <h2>{book.title}</h2>
              <p className="text-muted">{book.author}</p>
              <p>Published: {book.year}</p>
              <div className="d-flex align-items-center mb-3">
                <span style={{ marginRight: "0.5rem" }}>Rating:</span>
                <div>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      style={{ color: i < book.avgRating ? "#FFD700" : "#ccc" }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <Badge
                  bg=""
                  style={{
                    backgroundColor: COLORS.seafoam,
                    marginLeft: "1rem",
                  }}
                >
                  {book.avgRating}
                </Badge>
              </div>

              <div className="d-flex align-items-center mb-3">
                <span style={{ marginRight: "0.5rem" }}>Price: AUD </span>

                <Badge
                  bg=""
                  style={{
                    backgroundColor: COLORS.dark,
                  }}
                >
                  {book.price}
                </Badge>
              </div>
              {/* make user is logged in for */}

              {user?._id ? (
                book.isAvailable ? (
                  <Button
                    style={{
                      backgroundColor: COLORS.accent,
                      borderColor: COLORS.accent,
                    }}
                    onClick={() => {
                      handleBorrow(book._id);
                    }}
                  >
                    Borrow
                  </Button>
                ) : (
                  <Button
                    style={{
                      backgroundColor: COLORS.seafoam,
                      borderColor: COLORS.seafoam,
                    }}
                    disabled
                  >
                    Book will be available : {book.expectedAvailable}
                  </Button>
                )
              ) : (
                <>
                  <Button
                    style={{
                      backgroundColor: COLORS.dark,
                      borderColor: COLORS.dark,
                    }}
                    onClick={() => {
                      navigate("/login");
                    }}
                  >
                    Login to Burrow
                  </Button>
                </>
              )}
              {isPaying ? (
                <>
                  <h1>
                    Payment
                    <hr />
                  </h1>
                  <Elements stripe={stripePromise} options={options}>
                    <PaymentComponent setIsPaying={setIsPaying} />
                  </Elements>
                </>
              ) : (
                <></>
              )}

              <div className="mt-4">
                <h5>Reviews</h5>
                {book?.reviews?.map((r) => {
                  return (
                    <div
                      style={{
                        backgroundColor: COLORS.white,
                        padding: "1rem",
                        borderRadius: "0.5rem",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.02)",
                      }}
                    >
                      <p className="mb-1">
                        <strong>{r.userId.fName}</strong>— {r.title} “
                        {r.description}”
                      </p>
                      <p className="small text-muted mb-0">
                        Rated {r.rating}/5
                      </p>
                    </div>
                  );
                })}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  } else {
    return (
      <>
        <h1>no</h1>
      </>
    );
  }
};

export default BookDetailPage;
